import { useCallback, useEffect, useRef, useState } from "react";

export type useAudioControllerOptions = {
  src: string;
  initialVolume?: number;
  initialLoop?: boolean;
};

export const useAudioController = ({
  src,
  initialVolume = 0.5,
  initialLoop = false,
}: useAudioControllerOptions) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const fadeTimerRef = useRef<number | null>(null);

  const [isReady, setReady] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [loop, setLoop] = useState(initialLoop);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(initialVolume);

  // 오디오/오디오 그래프 초기화
  useEffect(() => {
    const audio = new Audio();
    audio.src = src;
    audio.preload = "metadata";
    audio.loop = initialLoop;
    audio.volume = 1;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setReady(true);
    };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audioRef.current = audio;

    try {
      const ctx = new AudioContext();
      const srcNode = ctx.createMediaElementSource(audio);
      const gain = ctx.createGain();
      gain.gain.value = initialVolume;
      srcNode.connect(gain).connect(ctx.destination);

      ctxRef.current = ctx;
      sourceNodeRef.current = srcNode;
      gainRef.current = gain;
    } catch (e) {
      console.warn("AudioContext 생성 실패", e);
    }

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);

      if (fadeTimerRef.current) cancelAnimationFrame(fadeTimerRef.current);

      sourceNodeRef.current?.disconnect();
      gainRef.current?.disconnect();
      ctxRef.current?.close();
    };
  }, [src, initialLoop, initialVolume]);

  // 공통: AudioContext resume(모바일/사파리)
  const ensureAudioContext = useCallback(async () => {
    const ctx = ctxRef.current;
    if (ctx && ctx.state === "suspended") {
      await ctx.resume();
    }
  }, []);

  // ----- Controls -----
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    await ensureAudioContext();
    await audio.play();
  }, [ensureAudioContext]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [isPlaying, pause, play]);

  const setLooping = useCallback((val: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = val;
    setLoop(val);
  }, []);

  // GainNode를 통한 볼륨 제어 (0~1)
  const setVolume = useCallback((v: number) => {
    const gain = gainRef.current;
    const clamped = Math.max(0, Math.min(1, v));
    if (gain) {
      // 클릭 잡음 방지: linearRampToValueAtTime
      const ctx = ctxRef.current!;
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(clamped, now + 0.01);
    } else {
      // 폴백: Audio.volume
      if (audioRef.current) audioRef.current.volume = clamped;
    }
    setVolumeState(clamped);
  }, []);

  // ----- Fades -----
  const fadeTo = useCallback((target: number, durationMs: number) => {
    const gain = gainRef.current;
    const ctx = ctxRef.current;
    const audio = audioRef.current;
    if (!audio) return;

    const start = performance.now();
    const startVol = gain ? gain.gain.value : audio.volume;
    const endVol = Math.max(0, Math.min(1, target));
    const dur = Math.max(0, durationMs);

    if (fadeTimerRef.current) cancelAnimationFrame(fadeTimerRef.current);

    const step = (t: number) => {
      const elapsed = t - start;
      const k = dur === 0 ? 1 : Math.min(1, elapsed / dur);
      const val = startVol + (endVol - startVol) * k;

      if (gain && ctx) {
        // 곡선 보정 없이 선형
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(val, now);
      } else if (audio) {
        audio.volume = val;
      }
      setVolumeState(val);

      if (k < 1) {
        fadeTimerRef.current = requestAnimationFrame(step);
      }
    };
    fadeTimerRef.current = requestAnimationFrame(step);
  }, []);

  const fadeOut = useCallback(
    async (durationMs: number, targetVol = 0) => {
      await ensureAudioContext();
      fadeTo(targetVol, durationMs);
    },
    [fadeTo, ensureAudioContext]
  );

  const fadeIn = useCallback(
    async (durationMs: number, targetVol = 1) => {
      await ensureAudioContext();
      // 시작이 0이 아닐 수도 있으니 명시적으로 0으로 세팅 후 페이드
      setVolume(0);
      fadeTo(targetVol, durationMs);
    },
    [fadeTo, setVolume, ensureAudioContext]
  );

  return {
    // state
    isReady,
    isPlaying,
    loop,
    duration,
    currentTime,
    volume,
    // controls
    play,
    pause,
    stop,
    toggle,
    setLooping,
    setVolume,
    fadeIn,
    fadeOut,
    // 내부 참조(필요 시)
    audioEl: audioRef,
  };
};

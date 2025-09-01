"use client";

import {
  useAudioController,
  useAudioControllerOptions,
} from "@/hooks/useAudioController";

export const AudioButton = (props: useAudioControllerOptions) => {
  const { src, initialLoop, initialVolume } = props;
  const { play, volume, setVolume, fadeOut, fadeIn } = useAudioController({
    src,
    initialLoop,
    initialVolume,
  });

  return (
    <>
      <button onClick={play}>재생</button>;
    </>
  );
};

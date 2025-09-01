import { AudioButton } from "@/components/audio/AudioButton";
import * as S from "./page.css";

const Envelope = () => {
  return (
    <div className={`${S.EnvelopeWrap} bg`}>
      <AudioButton src="./music-enter.mp3" initialLoop />
      <div> 얘를 클릭하면 Audio 재생</div>
    </div>
  );
};

export default Envelope;

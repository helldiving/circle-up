import { useRef, useCallback } from "react";

const useAudio = (src) => {
  const audioRef = useRef(new Audio(src));

  const play = useCallback(() => {
    audioRef.current
      .play()
      .catch((e) => console.error("Error playing audio:", e));
  }, []);

  const stop = useCallback(() => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  return { play, stop };
};

export default useAudio;

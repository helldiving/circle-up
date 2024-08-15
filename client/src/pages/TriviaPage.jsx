import React from "react";
import { useNavigate } from "react-router-dom";
import VideoBackground from "../components/VideoBackground";
import TriviaComponent from "../components/TriviaComponent";

const TriviaPage = () => {
  const navigate = useNavigate();

  const handleTriviaComplete = () => {
    navigate("/auth");
  };

  return (
    <VideoBackground
      videoSrc="/assets/therock.mp4"
      audioSrc="/assets/therock.mp3"
      fillMode="responsive"
      fullScreen={true}
    >
      <TriviaComponent onComplete={handleTriviaComplete} />
    </VideoBackground>
  );
};

export default TriviaPage;

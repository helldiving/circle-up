import { useState, useCallback } from "react";

const useTrivia = (triviaData) => {
  const [currentTrivia, setCurrentTrivia] = useState(
    triviaData[Math.floor(Math.random() * triviaData.length)]
  );
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const checkAnswer = useCallback(
    (selectedAnswer) => {
      if (selectedAnswer === currentTrivia.correctAnswer) {
        setShowPasswordPrompt(true);
        return true;
      } else {
        setCurrentTrivia(
          triviaData[Math.floor(Math.random() * triviaData.length)]
        );
        return false;
      }
    },
    [currentTrivia, triviaData]
  );

  return {
    currentTrivia,
    checkAnswer,
    showPasswordPrompt,
    setShowPasswordPrompt,
  };
};

export default useTrivia;

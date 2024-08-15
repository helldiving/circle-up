import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Button,
  Input,
  VStack,
  Grid,
  Text,
  Image,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";
import useTrivia from "../hooks/useTrivia";
import { triviaData } from "../data/triviaData";
import { useRecoilState } from "recoil";
import { triviaCompletedAtom } from "../atoms/triviaAtom.js";

const TriviaComponent = () => {
  const navigate = useNavigate();
  const {
    currentTrivia,
    checkAnswer,
    showPasswordPrompt,
    setShowPasswordPrompt,
  } = useTrivia(triviaData);

  const [enteredPassword, setEnteredPassword] = useState("");
  const [triviaCompleted, setTriviaCompleted] =
    useRecoilState(triviaCompletedAtom);
  const [incorrectImage, setIncorrectImage] = useState(null);
  const incorrectSoundRef = useRef(null);
  const [isIncorrectFeedbackActive, setIsIncorrectFeedbackActive] =
    useState(false);

  const containerWidth = useBreakpointValue({ base: "90%", md: "60%" });
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const buttonFontSize = useBreakpointValue({ base: "sm", md: "md" });
  const incorrectImageTop = useBreakpointValue({ base: "0%", md: "0" });
  const incorrectImageMaxHeight = useBreakpointValue({
    base: "100vh",
    md: "70vh",
  });
  const incorrectImageMaxWidth = useBreakpointValue({
    base: "80vw",
    md: "60vw",
  });

  useEffect(() => {
    incorrectSoundRef.current = new Audio("/assets/incorrectSound.mp3");
    return () => {
      if (incorrectSoundRef.current) {
        incorrectSoundRef.current.pause();
        incorrectSoundRef.current = null;
      }
    };
  }, []);

  const getRandomIncorrectImage = () => {
    const imageNumber = Math.floor(Math.random() * 22) + 1;
    return `/assets/incorrectimage${imageNumber}.jpg`;
  };

  const playIncorrectSound = () => {
    if (incorrectSoundRef.current) {
      incorrectSoundRef.current.currentTime = 0;
      incorrectSoundRef.current
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
  };

  const showIncorrectFeedback = () => {
    setIsIncorrectFeedbackActive(true);
    playIncorrectSound();
    setIncorrectImage(getRandomIncorrectImage());
    setTimeout(() => {
      setIsIncorrectFeedbackActive(false);
      setIncorrectImage(null);
    }, 1000);
  };

  const getGridColumns = (optionsLength) => {
    if (optionsLength <= 2) return 1;
    if (optionsLength <= 4) return 2;
    return 3;
  };

  const handleAnswer = useCallback(
    (selectedAnswer) => {
      if (!isIncorrectFeedbackActive) {
        const isCorrect = checkAnswer(selectedAnswer);
        if (isCorrect) {
          setShowPasswordPrompt(true);
        } else {
          showIncorrectFeedback();
        }
      }
    },
    [checkAnswer, setShowPasswordPrompt, isIncorrectFeedbackActive]
  );

  const handlePasswordSubmit = useCallback(() => {
    const correctPassword = "password";
    if (enteredPassword === correctPassword) {
      setTriviaCompleted(true);
      navigate("/auth");
    } else {
      console.log("Incorrect password!");
    }
    setEnteredPassword("");
  }, [enteredPassword, navigate, setTriviaCompleted]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="flex-start"
      width="100%"
      height="120%"
      pt="15vh"
    >
      <Box
        width={containerWidth}
        maxWidth="500px"
        px={containerPadding}
        py={8}
        borderRadius="md"
      >
        <VStack spacing={8} align="center">
          {showPasswordPrompt ? (
            <>
              <Heading
                as="h2"
                size="xl"
                mb={6}
                color="white"
                textAlign="center"
              >
                Enter Password
              </Heading>
              <Input
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="Enter password"
                size="lg"
                color="white"
              />
              <Button onClick={handlePasswordSubmit} size="lg">
                Submit
              </Button>
            </>
          ) : (
            <>
              <Heading
                as="h2"
                size="xl"
                mb={6}
                color="white"
                textAlign="center"
              >
                {currentTrivia.question}
              </Heading>
              <Box width="100%">
                <Grid
                  templateColumns={`repeat(${getGridColumns(
                    currentTrivia.options.length
                  )}, 1fr)`}
                  gap={4}
                  width="100%"
                >
                  {currentTrivia.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      height="auto"
                      minHeight="50px"
                      py={2}
                      px={3}
                      whiteSpace="normal"
                      wordBreak="break-word"
                      bg="rgba(255, 255, 255, 0.2)"
                      color="white"
                      _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
                      _active={{ bg: "rgba(255, 255, 255, 0.4)" }}
                      isDisabled={isIncorrectFeedbackActive}
                    >
                      <Text fontSize={buttonFontSize}>{option}</Text>
                    </Button>
                  ))}
                </Grid>
              </Box>
            </>
          )}
        </VStack>
      </Box>

      {incorrectImage && (
        <Box
          position="fixed"
          top={incorrectImageTop}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          paddingTop="8vh"
          zIndex={9999}
          bg="rgba(0,0,0,0.7)"
        >
          <Image
            src={incorrectImage}
            maxHeight={incorrectImageMaxHeight}
            maxWidth={incorrectImageMaxWidth}
            objectFit="contain"
          />
        </Box>
      )}
    </Flex>
  );
};

export default TriviaComponent;

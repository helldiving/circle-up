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
  Spinner,
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
  const [preloadedImages, setPreloadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

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

  const preloadImages = useCallback(async () => {
    const imageUrls = Array.from(
      { length: 17 },
      (_, i) => `/assets/incorrectimage${i + 1}.jpg`
    );

    try {
      const loadedImages = await Promise.all(
        imageUrls.map((url) =>
          fetch(url)
            .then((response) => response.blob())
            .then((blob) => URL.createObjectURL(blob))
        )
      );
      console.log("Images preloaded successfully:", loadedImages);
      setPreloadedImages(loadedImages);
      return true;
    } catch (error) {
      console.error("Error preloading images:", error);
      return false;
    }
  }, []);

  const preloadAudio = useCallback(() => {
    return new Promise((resolve) => {
      incorrectSoundRef.current = new Audio("/assets/incorrectSound.mp3");
      incorrectSoundRef.current.addEventListener(
        "canplaythrough",
        () => {
          console.log("Audio loaded successfully");
          resolve(true);
        },
        { once: true }
      );
      incorrectSoundRef.current.addEventListener(
        "error",
        () => {
          console.error("Error loading audio");
          resolve(false);
        },
        { once: true }
      );
      incorrectSoundRef.current.load();
    });
  }, []);

  useEffect(() => {
    const loadAssets = async () => {
      setIsLoading(true);
      const [imagesLoaded, audioLoaded] = await Promise.all([
        preloadImages(),
        preloadAudio(),
      ]);
      console.log("Assets loaded:", { imagesLoaded, audioLoaded });
      setAssetsLoaded(imagesLoaded && audioLoaded);
      setIsLoading(false);
    };

    loadAssets();

    return () => {
      if (incorrectSoundRef.current) {
        incorrectSoundRef.current.pause();
        incorrectSoundRef.current = null;
      }
      preloadedImages.forEach(URL.revokeObjectURL);
    };
  }, [preloadImages, preloadAudio]);

  const getRandomIncorrectImage = useCallback(() => {
    console.log("Preloaded images count:", preloadedImages.length);
    if (preloadedImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * preloadedImages.length);
      const selectedImage = preloadedImages[randomIndex];
      console.log("Selected image:", selectedImage);
      return selectedImage;
    }
    console.warn("No preloaded images available");
    return null;
  }, [preloadedImages]);

  const playIncorrectSound = useCallback(() => {
    if (incorrectSoundRef.current) {
      incorrectSoundRef.current.currentTime = 0;
      incorrectSoundRef.current
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    } else {
      console.warn("Incorrect sound reference is not available");
    }
  }, []);

  const showIncorrectFeedback = useCallback(() => {
    console.log("Showing incorrect feedback. Assets loaded:", assetsLoaded);
    if (!assetsLoaded) {
      console.warn("Assets not yet loaded, skipping incorrect feedback");
      return;
    }
    setIsIncorrectFeedbackActive(true);
    playIncorrectSound();
    const randomImage = getRandomIncorrectImage();
    console.log("Setting incorrect image:", randomImage);
    if (randomImage) {
      setIncorrectImage(randomImage);
      setTimeout(() => {
        setIsIncorrectFeedbackActive(false);
        setIncorrectImage(null);
      }, 1000);
    } else {
      console.error("Failed to get a random incorrect image");
      setIsIncorrectFeedbackActive(false);
    }
  }, [getRandomIncorrectImage, playIncorrectSound, assetsLoaded]);

  const handleAnswer = useCallback(
    (selectedAnswer) => {
      console.log("Handling answer. Assets loaded:", assetsLoaded);
      if (!isIncorrectFeedbackActive && assetsLoaded) {
        const isCorrect = checkAnswer(selectedAnswer);
        if (isCorrect) {
          setShowPasswordPrompt(true);
        } else {
          showIncorrectFeedback();
        }
      }
    },
    [
      checkAnswer,
      setShowPasswordPrompt,
      isIncorrectFeedbackActive,
      showIncorrectFeedback,
      assetsLoaded,
    ]
  );

  const getGridColumns = useCallback((optionsLength) => {
    if (optionsLength <= 2) return 1;
    if (optionsLength <= 4) return 2;
    return 3;
  }, []);

  const handlePasswordSubmit = useCallback(() => {
    const correctPassword = "rock";
    if (enteredPassword === correctPassword) {
      setTriviaCompleted(true);
      localStorage.setItem("trivia-completed", "true");
      navigate("/auth");
    } else {
      console.log("Incorrect password!");
    }
    setEnteredPassword("");
  }, [enteredPassword, navigate, setTriviaCompleted]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="white" />
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="flex-start"
      width="100%"
      height="125%"
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
                placeholder="password: rock"
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
                mb={0}
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
          paddingTop="6vh"
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

import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Button, VStack } from "@chakra-ui/react";
import VideoBackground from "./VideoBackground";

const ClickToEnter = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/trivia");
  };

  return (
    <VideoBackground
      videoSrc="/assets/clicktoentervid.mp4"
      fillMode="fill"
      fullScreen={true}
    >
      <VStack
        spacing={8}
        align="center"
        justify="center"
        height="100vh"
        width="100%"
        px={4}
      >
        <Heading
          as="h1"
          size={["xl", "xl", "2xl"]}
          textAlign="center"
          color="white"
        >
          Welcome to the Lil Amigoverse
        </Heading>
        <Button
          onClick={handleEnter}
          size={["md", "lg"]}
          px={8}
          py={4}
          bg="#9db3cc"
          color="white"
          _hover={{ bg: "#484955" }}
          fontSize={["md", "lg", "xl"]}
        >
          Enter
        </Button>
      </VStack>
    </VideoBackground>
  );
};

export default ClickToEnter;

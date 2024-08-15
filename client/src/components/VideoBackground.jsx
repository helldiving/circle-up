import React, { useRef, useEffect, useState } from "react";
import { Box, Text, useBreakpointValue } from "@chakra-ui/react";
import PropTypes from "prop-types";

const VideoBackground = ({
  children,
  videoSrc,
  audioSrc,
  fillMode = "responsive",
  fullScreen = false,
}) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [error, setError] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const isMountedRef = useRef(true);

  const objectFit = useBreakpointValue({
    base: "cover",
    md: fillMode === "fill" ? "cover" : "contain",
  });

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const playMedia = async () => {
      try {
        if (videoRef.current) {
          await videoRef.current.play();
        }
        if (audioRef.current) {
          await audioRef.current.play();
        }
      } catch (error) {
        console.log("Autoplay failed:", error);
      }
    };

    playMedia();

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [videoSrc, audioSrc]);

  const getObjectFit = () => {
    if (fillMode === "fill") {
      return "cover";
    }
    if (fillMode === "responsive") {
      return ["cover", "cover", "contain"];
    }
    return "contain";
  };

  return (
    <Box
      position={fullScreen ? "fixed" : "relative"}
      top={0}
      left={0}
      right={0}
      bottom={0}
      h="100vh"
      w="100%"
      overflow="hidden"
      bg="black"
    >
      {error ? (
        <Text color="red.500" textAlign="center" mt={4}>
          {error}
        </Text>
      ) : (
        <>
          <Box
            as="video"
            ref={videoRef}
            src={videoSrc}
            loop
            muted
            playsInline
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            objectFit={objectFit}
            onError={(e) => {
              console.error("Video error:", e);
              if (isMountedRef.current) {
                setError(
                  `Video error: ${e.target.error?.message || "Unknown error"}`
                );
              }
            }}
            onLoadedData={() => setVideoLoaded(true)}
          />
          <audio
            ref={audioRef}
            src={audioSrc}
            loop
            onError={(e) => {
              console.error("Audio error:", e);
              if (isMountedRef.current) {
                setError(
                  `Audio error: ${e.target.error?.message || "Unknown error"}`
                );
              }
            }}
          />
        </>
      )}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1}
        overflow="auto"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {children}
      </Box>
      {!videoLoaded && (
        <Text color="white" position="absolute" top={4} left={4} zIndex={2}>
          Loading video...
        </Text>
      )}
    </Box>
  );
};

VideoBackground.propTypes = {
  children: PropTypes.node.isRequired,
  videoSrc: PropTypes.string.isRequired,
  audioSrc: PropTypes.string,
  fillMode: PropTypes.oneOf(["fill", "responsive", "contain"]),
  fullScreen: PropTypes.bool,
};

export default React.memo(VideoBackground);

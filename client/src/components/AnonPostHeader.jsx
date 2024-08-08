import React from "react";
import { Avatar, Box, Flex } from "@chakra-ui/react";

const AnonPostHeader = ({ shuffledUsers }) => {
  const users = Array.isArray(shuffledUsers) ? shuffledUsers : [];

  if (users.length === 0) {
    return <Avatar size="md" src="/anonymous-avatar.png" name="Anonymous" />;
  }

  const avatarSize = "sm"; // Slightly larger size for better visibility
  const containerSize = "60px"; // Increased size to accommodate the triangle

  return (
    <Box position="relative" width={containerSize} height={containerSize}>
      {users.slice(0, 3).map((user, index) => (
        <Avatar
          key={user._id || index}
          size={avatarSize}
          name={user.username}
          src={user.profilePic}
          position="absolute"
          border="2px solid white"
          {...getPosition(index, users.length)}
        />
      ))}
    </Box>
  );
};

const getPosition = (index, total) => {
  switch (total) {
    case 1:
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    case 2:
      return index === 0
        ? { top: "5px", left: "5px" }
        : { bottom: "5px", right: "5px" };
    case 3:
    default:
      switch (index) {
        case 0:
          return { top: "45%", left: "70%", transform: "translateX(-50%)" };
        case 1:
          return { bottom: "0", left: "0" };
        case 2:
          return { bottom: "50%", right: "0" };
      }
  }
};

export default AnonPostHeader;

import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Box,
  List,
  ListItem,
  Text,
  Avatar,
  Flex,
} from "@chakra-ui/react";

const TagInput = ({ tags, setTags, existingUsers }) => {
  const [input, setInput] = useState("");
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [isShowingUsers, setIsShowingUsers] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (input.includes("@")) {
      const searchTerm = input.split("@").pop().toLowerCase();
      if (Array.isArray(existingUsers)) {
        const matches = existingUsers.filter((user) =>
          user.username.toLowerCase().includes(searchTerm)
        );
        setMatchingUsers(matches);
        setIsShowingUsers(matches.length > 0);
      } else {
        console.error("existingUsers is not an array:", existingUsers);
        setMatchingUsers([]);
        setIsShowingUsers(false);
      }
    } else {
      setIsShowingUsers(false);
    }
  }, [input, existingUsers]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleUserSelect = (user) => {
    const newInput = input.replace(/@\w+$/, `@${user.username} `);
    setInput(newInput);
    setIsShowingUsers(false);
    inputRef.current.focus();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !isShowingUsers) {
      e.preventDefault();
      const newTags = input.match(/@(\w+)/g) || [];
      setTags([...new Set([...tags, ...newTags.map((tag) => tag.slice(1))])]);
      setInput("");
    }
  };

  return (
    <Box position="relative">
      <Input
        ref={inputRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Type @ to tag users"
      />
      {isShowingUsers && (
        <List
          position="absolute"
          width="100%"
          bg="white"
          boxShadow="md"
          borderRadius="md"
          mt={1}
          maxH="200px"
          overflowY="auto"
        >
          {matchingUsers.map((user) => (
            <ListItem
              key={user._id}
              onClick={() => handleUserSelect(user)}
              _hover={{ bg: "gray.100" }}
              cursor="pointer"
              p={2}
            >
              <Flex align="center">
                <Avatar size="sm" src={user.profilePic} mr={2} />
                <Text>{user.username}</Text>
              </Flex>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default TagInput;

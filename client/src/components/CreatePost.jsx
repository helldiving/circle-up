import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

import { useParams } from "react-router-dom";
import postsAtom from "../atoms/postsAtom";
import TagInput from "./TagInput";
import { PiSmileyWinkBold } from "react-icons/pi";
import UserSelection from "./UserSelection";

const MAX_CHAR = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(500);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [existingUsers, setExistingUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const response = await fetch("/api/users/all");
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const filteredUsers = data.filter(
          (user) => user._id !== currentUser._id
        );
        setExistingUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setExistingUsers([]);
      }
    };
    fetchUsers();
  }, [currentUser._id]);

  // Handle text change in the post input
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    setPostText(inputText);

    const lastWord = inputText.split(" ").pop();
    if (lastWord.startsWith("@") && lastWord.length > 1) {
      const searchTerm = lastWord.slice(1).toLowerCase();
      const matches = existingUsers.filter((user) =>
        user.username.toLowerCase().startsWith(searchTerm)
      );
      setMatchingUsers(matches);
      setShowUserList(true);
    } else {
      setShowUserList(false);
    }

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleUserSelect = (username, userId) => {
    const words = postText.split(" ");
    words[words.length - 1] = `@${username} `;
    const newText = words.join(" ");
    setPostText(newText);
    setShowUserList(false);
    setTaggedUsers([...taggedUsers, { username, _id: userId }]);
  };

  // Handle creating a new post
  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const postData = {
        postedBy: currentUser._id,
        text: postText,
        img: imgUrl,
        taggedUsers: taggedUsers.map((u) => u._id),
        isAnonymous: isAnonymous,
        selectedUsers: isAnonymous ? selectedUsers.map((u) => u._id) : [],
      };

      console.log("Sending post data:", postData);

      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await res.json();
      console.log("Received post data:", data);

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post created successfully", "success");
      // If on user's own profile page, add new post to the top of the list
      if (username === currentUser.username) {
        setPosts([data, ...posts]);
      }
      // Add new post to the global posts state
      setPosts([data, ...posts]);
      onClose();
      setPostText(""); // reset text
      setImgUrl(""); // reset image
      setIsAnonymous(false); // reset anonymous state
      setSelectedUsers([]); // reset selected users
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      // Reset updating state regardless of outcome
      setLoading(false);
    }
  };

  // Anonymous Post toggle
  const handleAnonymousToggle = () => {
    setIsAnonymous(!isAnonymous);
  };
  // Anonymous User Select
  const handleUserSelection = (user) => {
    if (selectedUsers.length < 2 || selectedUsers.includes(user)) {
      setSelectedUsers((prevUsers) =>
        prevUsers.includes(user)
          ? prevUsers.filter((u) => u !== user)
          : [...prevUsers, user]
      );
    }
  };

  return (
    <>
      {/* Create post button */}
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
        <AddIcon />
      </Button>

      {/* Create post modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              {/* Post text input */}
              <Textarea
                placeholder="Post content goes here..."
                onChange={handleTextChange}
                value={postText}
              />
              {showUserList && (
                <Box mt={2} boxShadow="md" borderWidth="1px" borderRadius="md">
                  {matchingUsers.map((user) => (
                    <Box
                      key={user._id}
                      p={2}
                      _hover={{ bg: "gray.100" }}
                      cursor="pointer"
                      onClick={() => handleUserSelect(user.username, user._id)}
                    >
                      {user.username}
                    </Box>
                  ))}
                </Box>
              )}
              {/* Remaining character count */}
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              {/* Hidden file input for image upload */}
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              {/* Image upload icon */}
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()} // will open Input right above
              />
              {/* Anonymous posting toggle */}
              <Button onClick={handleAnonymousToggle} mt={2}>
                <PiSmileyWinkBold />
                {isAnonymous ? "Post Anonymously" : "Post Normally"}
              </Button>
            </FormControl>

            {/* Selected image preview */}
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
            {/* User selection for anonymous posting */}
            {isAnonymous && (
              <UserSelection
                selectedUsers={selectedUsers}
                onUserSelect={handleUserSelection}
                existingUsers={existingUsers}
              />
            )}
          </ModalBody>
          {/* Post button */}
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    // State to store the input values
    // when adding occupation and location, add here after userController
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
    badgeText: user.badgeText || "",
    website: user.website || "",
    instagram: user.instagram || "",
  });

  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  const { handleImageChange, imgUrl } = usePreviewImg();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updating) return;
    setUpdating(true);

    try {
      // Send a request to update the user profile
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Profile updated successfully", "success");
      setUser(data);
      localStorage.setItem("user-info", JSON.stringify(data));
      navigate(`/${data.username}`);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  // Cancel button redirects to user profile page
  const handleCancel = () => {
    navigate(`/${user.username}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                {/* User avatar */}
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl || user.profilePic}
                />
              </Center>
              <Center w="full">
                {/* Change avatar button */}
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                {/* Hidden file input */}
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Name</FormLabel>
            {/* Name input field */}
            <Input
              placeholder="Little Amigo"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            {/* Username input field */}
            <Input
              placeholder="lb123"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            {/* Email input field */}
            <Input
              placeholder="your-email@example.com"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Badge Text</FormLabel>
            <Input
              placeholder="Your custom badge text"
              value={inputs.badgeText}
              onChange={(e) =>
                setInputs({ ...inputs, badgeText: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            {/* Bio input field */}
            <Input
              placeholder="What's to know?"
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Website</FormLabel>
            <Input
              placeholder="Include https:// in your link"
              value={inputs.website}
              onChange={(e) =>
                setInputs({ ...inputs, website: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="url"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Instagram</FormLabel>
            <Input
              placeholder="Your Instagram profile URL"
              value={inputs.instagram}
              onChange={(e) =>
                setInputs({ ...inputs, instagram: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="url"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            {/* Password input field */}
            <Input
              placeholder="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            {/* Cancel button */}
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            {/* Submit button */}
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}

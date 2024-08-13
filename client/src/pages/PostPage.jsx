import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import userAtom from "../atoms/userAtom";
import AnonPostHeader from "../components/AnonPostHeader";
// import { get } from "mongoose";

// we accept the post atom as an array of objects. inside actions we write our code as posts atoms is an array, so we use map component in Actions.jsx. So here we have to destructure the array and get the first object from the array.

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const teabagPostIcon = useColorModeValue(
    "/anonymous5lightmode.png",
    "/anonymous5.png"
  );
  const anonPostIcon = useColorModeValue(
    "/anonymous2lightmode.png",
    "/anonymous2.png"
  );

  // Get the current post from the posts state (assuming it's the first post)
  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        // Send a request to fetch the post details
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        // Check for errors in the response
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        // Update the posts state with the fetched post
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    // Fetch the post details when the component mounts
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    // Confirm with the user before deleting the post
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      // Send a request to delete the post
      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      // Check for errors in the response
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  // Loading spinner while the user profile is being fetched
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  // Check if the current post exists
  if (!currentPost) return null;
  console.log("currentPost", currentPost);

  return (
    <>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          {currentPost.isAnonymous ? (
            <AnonPostHeader shuffledUsers={currentPost.shuffledUsers} />
          ) : (
            <Avatar
              src={currentPost.postedBy.profilePic}
              size={"md"}
              name={currentPost.postedBy.username}
            />
          )}
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {currentPost.replies.length === 0 && (
              <Text textAlign={"center"}>🗨️</Text>
            )}
            {currentPost.replies[0] && (
              <Avatar
                size="xs"
                name="Reply"
                src={currentPost.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
              />
            )}
            {currentPost.replies[1] && (
              <Avatar
                size="xs"
                name="Reply"
                src={currentPost.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}
              />
            )}
            {currentPost.replies[2] && (
              <Avatar
                size="xs"
                name="Reply"
                src={currentPost.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Box>
                {currentPost.isAnonymous ? (
                  <Flex alignItems="center">
                    <Text fontSize={"sm"} fontWeight={"bold"} mr={1}>
                      Anonymous
                    </Text>
                    <Image src={teabagPostIcon} w={4} h={4} mr={1} />
                    <Image src={anonPostIcon} w={4} h={4} />
                  </Flex>
                ) : (
                  <Flex alignItems="center">
                    <Text fontSize={"sm"} fontWeight={"bold"} mr={1}>
                      {currentPost.postedBy.username}
                    </Text>
                    <Image src="/verified.png" w={4} h={4} />
                  </Flex>
                )}
              </Box>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(currentPost.createdAt))} ago
              </Text>
              {currentUser?._id === currentPost.postedBy._id && (
                <DeleteIcon
                  size={20}
                  cursor={"pointer"}
                  onClick={handleDeletePost}
                />
              )}
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{currentPost.text}</Text>
          {currentPost.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={currentPost.img} w={"full"} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={currentPost} />
          </Flex>
        </Flex>
      </Flex>

      {/* <Divider my={4} />

      {/* Render the "Get the app" section }
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Share your thoughts...</Text>
        </Flex>
        <Button>Reply</Button>
      </Flex> */}

      {/* Replies */}
      <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;

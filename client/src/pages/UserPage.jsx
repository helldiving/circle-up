import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Box, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import UserReply from "../components/UserReply";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [replies, setReplies] = useState([]);
  const [fetchingReplies, setFetchingReplies] = useState(false);
  const [activeTab, setActiveTab] = useState("publications");
  const [userPosts, setUserPosts] = useState([]);
  const [taggedPosts, setTaggedPosts] = useState([]);
  const [teabagPosts, setTeabagPosts] = useState([]);

  const getPosts = async () => {
    if (!user) return;
    setFetchingPosts(true);
    try {
      const res = await fetch(`/api/posts/user/${username}`);
      console.log("Raw response:", res);
      const data = await res.json();
      console.log("Received data from server:", JSON.stringify(data, null, 2));

      if (data.userPosts && Array.isArray(data.userPosts)) {
        setUserPosts(data.userPosts);
        setTaggedPosts(data.taggedPosts || []);
        setTeabagPosts(data.teabagPosts || []);
        console.log("User's own posts:", data.userPosts.length);
        console.log(
          "Tagged posts:",
          data.taggedPosts ? data.taggedPosts.length : 0
        );
        console.log(
          "Teabag posts:",
          data.teabagPosts ? data.teabagPosts.length : 0
        );
      } else {
        console.error("Received unexpected data structure:", data);
        setUserPosts([]);
        setTaggedPosts([]);
        setTeabagPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setUserPosts([]);
      setTaggedPosts([]);
      setTeabagPosts([]);
    } finally {
      setFetchingPosts(false);
    }
  };

  const getReplies = async () => {
    if (!user) return;
    setFetchingReplies(true);
    try {
      const res = await fetch(`/api/users/replies/${username}`);
      const data = await res.json();
      console.log("Replies data:", JSON.stringify(data, null, 2));
      if (Array.isArray(data) && data.length > 0) {
        const validReplies = data.filter(
          (reply) => reply && reply.reply && reply.reply.createdAt
        );
        console.log("Valid replies:", JSON.stringify(validReplies, null, 2));
        setReplies(validReplies);
      } else {
        setReplies([]);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
      setReplies([]);
    } finally {
      setFetchingReplies(false);
    }
  };

  useEffect(() => {
    if (user) {
      getPosts();
      if (activeTab === "replies") getReplies();
    }
  }, [username, user, activeTab]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} />

      <Flex w={"full"} mb={4}>
        <Flex
          flex={1}
          borderBottom={
            activeTab === "publications" ? "2px solid" : "1px solid"
          }
          borderColor={activeTab === "publications" ? "blue.500" : "gray.light"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
          onClick={() => setActiveTab("publications")}
        >
          <Text fontWeight={"bold"}>Publications</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={activeTab === "replies" ? "2px solid" : "1px solid"}
          borderColor={activeTab === "replies" ? "blue.500" : "gray.light"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
          onClick={() => setActiveTab("replies")}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={activeTab === "teabags" ? "2px solid" : "1px solid"}
          borderColor={activeTab === "teabags" ? "blue.500" : "gray.light"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
          onClick={() => setActiveTab("teabags")}
        >
          <Text fontWeight={"bold"}>Teabags</Text>
        </Flex>
      </Flex>

      {activeTab === "publications" && (
        <>
          {!fetchingPosts && userPosts.length === 0 && (
            <Text>User has no publications.</Text>
          )}
          {fetchingPosts && (
            <Flex justifyContent={"center"} my={12}>
              <Spinner size={"xl"} />
            </Flex>
          )}
          {userPosts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
        </>
      )}

      {activeTab === "replies" && (
        <>
          {!fetchingReplies && replies.length === 0 && (
            <Text>User has no replies.</Text>
          )}
          {fetchingReplies && (
            <Flex justifyContent={"center"} my={12}>
              <Spinner size={"xl"} />
            </Flex>
          )}
          <VStack spacing={4} align="stretch">
            {replies.map((reply, index) => (
              <UserReply key={`${reply._id}-${index}`} reply={reply} />
            ))}
          </VStack>
        </>
      )}

      {activeTab === "teabags" && (
        <>
          {!fetchingPosts && teabagPosts.length === 0 && (
            <Text>User has not been teabagged.</Text>
          )}
          {fetchingPosts && (
            <Flex justifyContent={"center"} my={12}>
              <Spinner size={"xl"} />
            </Flex>
          )}
          {teabagPosts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
        </>
      )}
    </>
  );
};

export default UserPage;

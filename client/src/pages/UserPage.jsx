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
  const [repliesAndTags, setRepliesAndTags] = useState([]);
  const [fetchingRepliesAndTags, setFetchingRepliesAndTags] = useState(false);
  const [activeTab, setActiveTab] = useState("publications");
  const [userPosts, setUserPosts] = useState([]);
  const [taggedPosts, setTaggedPosts] = useState([]);
  const [teabagPosts, setTeabagPosts] = useState([]);

  const getPosts = async () => {
    if (!user) return;
    setFetchingPosts(true);
    try {
      const res = await fetch(`/api/posts/user/${username}`);
      const data = await res.json();

      if (data.userPosts && Array.isArray(data.userPosts)) {
        setUserPosts(data.userPosts);
        setTaggedPosts(data.taggedPosts || []);
        setTeabagPosts(data.teabagPosts || []);
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

  const getRepliesAndTags = async () => {
    if (!user) return;
    setFetchingRepliesAndTags(true);
    try {
      const [taggedRes, repliesRes] = await Promise.all([
        fetch(`/api/posts/tagged/${username}`),
        fetch(`/api/users/replies/${username}`),
      ]);
      const taggedData = await taggedRes.json();
      const repliesData = await repliesRes.json();

      const combinedData = [
        ...(taggedData.taggedPosts || []),
        ...(repliesData || []),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setRepliesAndTags(combinedData);
    } catch (error) {
      showToast("Error", error.message, "error");
      setRepliesAndTags([]);
    } finally {
      setFetchingRepliesAndTags(false);
    }
  };

  useEffect(() => {
    if (user) {
      getPosts();
      if (activeTab === "repliesAndTags") getRepliesAndTags();
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
          borderBottom={
            activeTab === "repliesAndTags" ? "2px solid" : "1px solid"
          }
          borderColor={
            activeTab === "repliesAndTags" ? "blue.500" : "gray.light"
          }
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
          onClick={() => setActiveTab("repliesAndTags")}
        >
          <Text fontWeight={"bold"}>Replies & Tags</Text>
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

      {activeTab === "repliesAndTags" && (
        <>
          {!fetchingRepliesAndTags && repliesAndTags.length === 0 && (
            <Text>User has no replies or tags.</Text>
          )}
          {fetchingRepliesAndTags && (
            <Flex justifyContent={"center"} my={12}>
              <Spinner size={"xl"} />
            </Flex>
          )}
          <VStack spacing={4} align="stretch">
            {repliesAndTags.map((item) =>
              item.postText ? (
                <UserReply key={item._id} reply={item} />
              ) : (
                <Post key={item._id} post={item} postedBy={item.postedBy} />
              )
            )}
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

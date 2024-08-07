import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  // Get the user profile using the custom hook
  const { user, loading } = useGetUserProfile();

  // Get the username from the URL parameters
  const { username } = useParams();

  // Custom hook to show toast notifications
  const showToast = useShowToast();

  // Get the posts state from the postsAtom and the setter function
  const [posts, setPosts] = useRecoilState(postsAtom);

  // State to track if the posts are being fetched
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    console.log("Current user:", user);

    const getPosts = async () => {
      // Check if the user exists before fetching posts
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log("Raw fetched posts data:", data);
        if (Array.isArray(data)) {
          console.log("Posts are an array with length:", data.length);
          data.forEach((post, index) => {
            console.log(`Post ${index}:`, {
              id: post._id,
              postedBy: post.postedBy.username,
              taggedUsers: post.taggedUsers.map((u) => u.username),
              text: post.text.substring(0, 50) + "...",
            });
          });
          setPosts(data);
        } else {
          console.error("Received non-array data:", data);
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    if (user) {
      getPosts();
    }
  }, [username, showToast, setPosts, user]);

  //     try {
  //       const res = await fetch(`/api/posts/user/${username}`);
  //       const data = await res.json();
  //       console.log("Fetched posts:", data);
  //       console.log(data);
  //       if (Array.isArray(data)) {
  //         setPosts(data);
  //       } else {
  //         console.error("Received non-array data:", data);
  //         setPosts([]);
  //       }
  //     } catch (error) {
  //       showToast("Error", error.message, "error");
  //       setPosts([]);
  //     } finally {
  //       setFetchingPosts(false);
  //     }
  //   };

  //   // Fetch the user's posts when the component mounts or the user changes
  //   getPosts();
  // }, [username, showToast, setPosts, user]);

  // Render a loading spinner while the user profile is being fetched
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  // Render a message if the user is not found
  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      {/* Render the user header */}
      <UserHeader user={user} />
      {/* Render a message if the user has no posts */}
      {!fetchingPosts && posts.length === 0 && <Text>User has no posts.</Text>}

      {/* Render a loading spinner while fetching posts */}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {/* Render the user's posts by passing props to Post component */}
      {posts.map((post) => {
        console.log("Full post object:", post);
        if (!post || !post.postedBy) {
          console.log("Skipping post due to missing postedBy:", post);
          return null;
        }
        return (
          <Box key={post._id}>
            {post.postedBy._id === user._id ? (
              <Text fontSize="sm" color="gray.500">
                {/* Your post */}
              </Text>
            ) : (
              <Text fontSize="sm" color="blue.500">
                {/* You were tagged in this post by @{post.postedBy.username}  */}
              </Text>
            )}
            <Post post={post} postedBy={post.postedBy} />
          </Box>
        );
      })}
    </>
  );
};

export default UserPage;

import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        // Send a request to fetch the feed posts
        const res = await fetch("/api/posts/feed");
        const data = await res.json();

        // Check for errors in the response
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);

        // Update the posts state with the fetched posts
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    // Fetch the feed posts when the component mounts
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap="10" alignItems={"flex-start"}>
      <Box flex={70}>
        {/* Render a message if there are no posts and loading is complete */}
        {!loading && posts.length === 0 && (
          <h1>Follow some users to see the feed</h1>
        )}

        {/* Render a loading spinner while posts are being fetched */}
        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}

        {/* Render the posts */}
        {posts.map((post) => {
          if (!post || !post.postedBy) {
            console.error("Invalid post data:", post);
            return null; // Skip rendering this post
          }
          return <Post key={post._id} post={post} postedBy={post.postedBy} />;
        })}
      </Box>
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      ></Box>
    </Flex>
  );
};

export default HomePage;

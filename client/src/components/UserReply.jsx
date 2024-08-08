import { Box, Flex, Text, Avatar } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const UserReply = ({ reply }) => {
  console.log("Full reply object:", JSON.stringify(reply, null, 2));

  const formatDate = (reply) => {
    const dateString = reply.reply?.createdAt || reply.createdAt;
    if (!dateString) {
      console.warn(
        "Missing date string for reply:",
        JSON.stringify(reply, null, 2)
      );
      return "Unknown time";
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn(
          "Invalid date string:",
          dateString,
          "for reply:",
          JSON.stringify(reply, null, 2)
        );
        return "Unknown time";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error(
        "Error formatting date:",
        error,
        "for reply:",
        JSON.stringify(reply, null, 2)
      );
      return "Unknown time";
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Flex alignItems="center">
          <Avatar size="sm" src={reply.postedBy?.profilePic} mr={2} />
          <Text fontWeight="bold">
            <Link to={`/${reply.postedBy?.username}`}>
              {reply.postedBy?.username || "Unknown User"}
            </Link>
          </Text>
        </Flex>
        <Text fontSize="sm" color="gray.500">
          {formatDate(reply)}
        </Text>
      </Flex>
      <Text mb={2}>{reply.postText}</Text>
      <Box mt={2} pl={4} borderLeftWidth="2px" borderLeftColor="gray.200">
        <Text fontSize="sm" fontStyle="italic">
          {reply.reply?.text || "No reply text available"}
        </Text>
      </Box>
      <Text fontSize="sm" color="blue.500" mt={2}>
        <Link to={`/${reply.postedBy?.username}/post/${reply._id}`}>
          View original post
        </Link>
      </Text>
    </Box>
  );
};

export default UserReply;

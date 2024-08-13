import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

// Renders comment
const Comment = ({ reply, lastReply }) => {
  return (
    <>
      <Flex gap={4} py={2} w={"full"}>
        {/* User avatar */}
        <Avatar src={reply.userProfilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {/* Username */}
            <Text fontSize="sm" fontWeight="bold">
              {reply.username}
            </Text>
          </Flex>
          {/* Comment text */}
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {/* Divider if not the last reply */}
      {/* {!lastReply ? <Divider /> : null} */}
    </>
  );
};

export default Comment;

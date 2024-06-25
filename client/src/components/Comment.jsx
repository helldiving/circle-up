import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

// Component for rendering a single comment
const Comment = ({ reply, lastReply }) => {
  return (
    <>
      <Flex gap={4} py={2} w={"full"}>
        {/* Render user avatar */}
        <Avatar src={reply.userProfilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {/* Render username */}
            <Text fontSize="sm" fontWeight="bold">
              {reply.username}
            </Text>
          </Flex>
          {/* Render comment text */}
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {/* Render divider if not the last reply */}
      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;

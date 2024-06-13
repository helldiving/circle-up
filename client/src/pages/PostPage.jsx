import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import Comment from "../components/Comment";

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="/paul-avatar.png" size={"md"} name="Paul Testing" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              sandsniffer
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            1d test
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>

      <Text my={3}> Let's talk about the Sphere. </Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src="/post1.png" w={"full"} />
      </Box>

      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          test replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}>
          {" "}
        </Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {1 + (liked ? 1 : 0)} liked
        </Text>
      </Flex>
      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>
            Sell your soul to comment, like, and, post.
          </Text>
        </Flex>
        <Button>Click here</Button>
      </Flex>

      <Divider my={4} />
      <Comment
        comment={"pooped on your floor"}
        createdAt="2d"
        likes={3}
        username="fridge3060ti"
        userAvatar="/fridge-avatar.png"
      />
      <Comment
        comment={"Mine too... all 12 guinea pigs"}
        createdAt="2d"
        likes={0}
        username="donald"
        userAvatar="/donald-avatar.png"
      />
      <Comment
        comment={
          "He doesn't look strong enough. It takes a really strong broad shoulder powerful man to do that."
        }
        createdAt="2d"
        likes={5}
        username="jjplays"
        userAvatar="/jarjar-avatar.png"
      />
    </>
  );
};

export default PostPage;

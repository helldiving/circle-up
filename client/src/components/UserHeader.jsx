import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useColorModeValue, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom); // logged in user
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  const badgeBg = useColorModeValue("gray.200", "gray.dark");
  const badgeColor = useColorModeValue("gray.800", "gray.light");

  // Copy the profile URL to clipboard
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Success.",
        status: "success",
        description: "Profile link copied.",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  // hides https:// from displaying with website on user profile page
  const formatWebsiteUrl = (url) => {
    if (!url) return "";
    return url.replace(/(^\w+:|^)\/\//, "");
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          {/* User name */}
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>@{user.username}</Text>
            {/* User badge */}
            {user.badgeText && (
              <Text
                fontSize={"xs"}
                // bg={"gray.dark"}
                // color={"gray.light"}
                bg={badgeBg}
                color={badgeColor}
                px={1}
                alignItems="25%"
                borderRadius={"full"}
                display="flex"
                justifyContent="center"
                height="20px"
              >
                {user.badgeText}
              </Text>
            )}
          </Flex>
        </Box>
        <Box>
          {/* User avatar */}
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "lg",
                md: "xl",
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>

      {/* User bio */}
      <Text>{user.bio}</Text>

      {/* Update profile button if the current user is the profile owner */}
      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      {/* Follow/unfollow button if the current user is not the profile owner */}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          {/* Follower count */}
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          {/* Website link */}
          {user.website ? (
            <Link href={user.website} isExternal color={"gray.light"}>
              {formatWebsiteUrl(user.website)}
            </Link>
          ) : (
            <Text color={"gray.light"}>circleup.live</Text>
          )}
        </Flex>
        <Flex>
          {/* Instagram Icon / Link*/}
          {user.instagram && (
            <Box className="icon-container">
              <Link href={user.instagram} isExternal>
                <BsInstagram size={24} cursor={"pointer"} />
              </Link>
            </Box>
          )}
          <Box className="icon-container">
            {/* More options menu */}
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;

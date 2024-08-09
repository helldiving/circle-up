import React from "react";
import { Flex, Avatar, Text } from "@chakra-ui/react";

const UserSelection = ({ selectedUsers, onUserSelect, existingUsers }) => {
  return (
    <Flex direction="column" mt={4}>
      <Text mb={2}>Select users to teabag (max 2):</Text>
      <Flex flexWrap="wrap">
        {existingUsers.map((user) => (
          <Avatar
            key={user._id}
            src={user.profilePic}
            name={user.username}
            onClick={() => onUserSelect(user)}
            opacity={selectedUsers.includes(user) ? 1 : 0.5}
            cursor="pointer"
            m={1}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default UserSelection;

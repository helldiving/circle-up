import React from "react";
import { Flex, Avatar, Text } from "@chakra-ui/react";

const UserSelection = ({ selectedUsers, onUserSelect, existingUsers }) => {
  return (
    <Flex direction="column" mt={4}>
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
            border={selectedUsers.includes(user) ? "2px solid white" : "none"}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default UserSelection;

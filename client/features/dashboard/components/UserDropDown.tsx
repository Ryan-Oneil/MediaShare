import React from "react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Avatar } from "@chakra-ui/react";

const UserDropDown = () => {
  return (
    <Menu>
      <MenuButton>
        <Avatar size={"sm"} />
      </MenuButton>
      <MenuList>
        <MenuItem>Settings</MenuItem>
        <MenuItem>API</MenuItem>
        <MenuItem>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserDropDown;

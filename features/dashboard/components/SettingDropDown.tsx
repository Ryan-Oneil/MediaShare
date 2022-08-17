import React from "react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { IconButton } from "@chakra-ui/react";
import { FaCog } from "react-icons/fa";

const SettingDropDown = () => {
  return (
    <Menu>
      <MenuButton
        _hover={{ bg: "gray.100" }}
        _active={{ bg: "gray.200" }}
        borderRadius={"md"}
      >
        <IconButton
          aria-label={"Settings"}
          icon={<FaCog />}
          variant={"ghost"}
        />
      </MenuButton>
      <MenuList>
        <MenuItem>Settings</MenuItem>
        <MenuItem>API</MenuItem>
        <MenuItem>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default SettingDropDown;

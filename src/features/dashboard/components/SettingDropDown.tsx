import React from "react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { IconButton } from "@chakra-ui/react";
import { FaCog } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { HOMEPAGE_URL } from "../../../utils/urls";
import { useRouter } from "next/router";

const SettingDropDown = () => {
  const router = useRouter();
  return (
    <Menu>
      <MenuButton as={IconButton} icon={<FaCog />} variant={"ghost"} />
      <MenuList>
        <MenuItem>Settings</MenuItem>
        <MenuItem>API</MenuItem>
        <MenuItem
          onClick={() => {
            getAuth()
              .signOut()
              .then(() => router.push(HOMEPAGE_URL));
          }}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default SettingDropDown;

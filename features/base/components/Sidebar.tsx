import {
  Box,
  IconButton,
  VStack,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tooltip,
  Text,
  HStack,
  Link,
  Flex,
  Icon,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaBars, FaRegComments, FaServer, FaSignOutAlt } from "react-icons/fa";
import NextLink from "next/link";
import { DASHBOARD_URL } from "../../../utils/urls";
import { NavItem } from "../types/NavItem";
import { useRouter } from "next/router";

export const Sidebar = () => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const [showDrawer, setShowDrawer] = useState(false);
  const urls: Array<NavItem> = [
    { url: DASHBOARD_URL, icon: <FaServer />, label: "Dashboard" },
    // { url: PROFILE_FIND_MATCHES, icon: <SearchIcon />, title: "Find Matches" },
    // { url: CHAT_URL, icon: <FaRegComment />, title: "Chats" },
  ];

  const NavLink = ({ url, icon, label }: NavItem) => {
    return (
      <NextLink href={url}>
        <Link
          variant="ghost"
          aria-label={label}
          fontSize="20px"
          color={"white"}
          // leftI={
          //   <Box
          //     color={"white"}
          //     // color={currentRoute === url ? "#2249B3" : "white"}
          //     fontSize={"4xl"}
          //   >
          //     {icon}
          //   </Box>
          // }
        >
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
              bg: "cyan.400",
              color: "white",
            }}
          >
            {icon}
            {label}
          </Flex>
        </Link>
      </NextLink>
    );
  };

  const NavMenu = () => {
    return (
      <VStack spacing={10} mt={20} h={"100%"}>
        {urls.map((navItem) => (
          <NavLink
            url={navItem.url}
            icon={navItem.icon}
            key={navItem.url}
            label={navItem.label}
          />
        ))}
        <Box mt={"auto!important"} mb={"150px!important"}>
          <Tooltip label={"Log out"}>
            <IconButton
              variant="ghost"
              aria-label={"Sign out"}
              fontSize="20px"
              // onClick={handleClick}
              icon={<FaSignOutAlt size={32} />}
            />
          </Tooltip>
        </Box>
      </VStack>
    );
  };

  return (
    <>
      <Box
        minHeight={"100vh"}
        boxShadow={"0px 0px 24px rgba(0, 0, 0, 0.08)"}
        display={{ base: "none", md: "block" }}
        bg={"#1A202C"}
      >
        <NextLink href={DASHBOARD_URL}>
          <FaRegComments size={52} color={"white"} />
        </NextLink>
        <NavMenu />
      </Box>
      <Box display={{ base: "block", md: "none" }} width={"100%"} p={5}>
        <IconButton
          icon={<FaBars />}
          variant="outline"
          onClick={() => setShowDrawer(true)}
          aria-label={"Menu label"}
        />
      </Box>
      {showDrawer && (
        <Drawer
          isOpen={showDrawer}
          placement="left"
          onClose={() => setShowDrawer(false)}
        >
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerBody>
                <NavMenu />
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      )}
    </>
  );
};

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
  Button,
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
    { url: DASHBOARD_URL, icon: <FaServer />, label: "Dashboard" },
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
          //     // color={currentRoute === url ? "#2249B3" : "white"}
        >
          <Flex
            align="center"
            p="4"
            px={10}
            cursor="pointer"
            _hover={{
              bg: "cyan.400",
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
      <VStack minHeight={"100vh"} bg={"#1A202C"} color={"white"}>
        <NextLink href={DASHBOARD_URL}>
          <Text p={5} align={"center"}>
            Media Share
          </Text>
        </NextLink>
        {urls.map((navItem) => (
          <NavLink
            url={navItem.url}
            icon={navItem.icon}
            key={navItem.url}
            label={navItem.label}
          />
        ))}

        <Button
          variant="ghost"
          aria-label={"Sign out"}
          fontSize="20px"
          // onClick={handleClick}
          leftIcon={<FaSignOutAlt />}
          mt={"auto!important"}
          mb={"5px!important"}
        >
          Log out
        </Button>
      </VStack>
    );
  };

  return (
    <>
      <Box
        boxShadow={"0px 0px 24px rgba(0, 0, 0, 0.08)"}
        display={{ base: "none", md: "block" }}
      >
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

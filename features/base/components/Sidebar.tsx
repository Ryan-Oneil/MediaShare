import {
  Box,
  VStack,
  Text,
  Link,
  Flex,
  Icon,
  Button,
  BoxProps,
} from "@chakra-ui/react";
import React from "react";
import { FaFolder, FaImages, FaServer, FaSignOutAlt } from "react-icons/fa";
import NextLink from "next/link";
import {
  DASHBOARD_URL,
  GALLERY_URL,
  HOMEPAGE_URL,
  USER_FILES_URL,
} from "../../../utils/urls";
import { NavItem } from "../types/NavItem";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";

export const Sidebar = (props: BoxProps) => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const urls: Array<NavItem> = [
    { url: DASHBOARD_URL, icon: FaServer, label: "Dashboard" },
    { url: GALLERY_URL, icon: FaImages, label: "Gallery" },
    { url: USER_FILES_URL, icon: FaFolder, label: "My Files" },
  ];

  const NavLink = ({ url, icon, label }: NavItem) => {
    return (
      <NextLink href={url} passHref>
        <Link variant="ghost" aria-label={label} fontSize="20px" w={"100%"}>
          <Flex
            align="center"
            p="4"
            pr={10}
            cursor="pointer"
            bg={currentRoute === url ? "brand.200" : ""}
            _hover={{
              bg: "brand.200",
            }}
          >
            <Icon as={icon} mr="4" />
            {label}
          </Flex>
        </Link>
      </NextLink>
    );
  };

  const NavMenu = () => {
    return (
      <VStack minHeight={"100vh"} bg={"brand.100"} color={"white"}>
        <NextLink href={HOMEPAGE_URL} passHref>
          <Link _hover={{ textDecoration: "none" }}>
            <Text
              p={5}
              align={"center"}
              fontSize={"xl"}
              fontWeight={"extrabold"}
            >
              Media Share
            </Text>
          </Link>
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
          leftIcon={<FaSignOutAlt />}
          mt={"auto!important"}
          mb={"5px!important"}
          _hover={{
            bg: "brand.200",
          }}
          onClick={() => {
            getAuth()
              .signOut()
              .then(() => router.push(HOMEPAGE_URL));
          }}
        >
          Log out
        </Button>
      </VStack>
    );
  };

  return (
    <Box boxShadow={"0px 0px 24px rgba(0, 0, 0, 0.08)"} {...props}>
      <NavMenu />
    </Box>
  );
};

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
import { FaServer, FaSignOutAlt } from "react-icons/fa";
import NextLink from "next/link";
import { DASHBOARD_URL, HOMEPAGE_URL } from "../../../utils/urls";
import { NavItem } from "../types/NavItem";
import { useRouter } from "next/router";

export const Sidebar = (props: BoxProps) => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const urls: Array<NavItem> = [
    { url: DASHBOARD_URL, icon: FaServer, label: "Dashboard" },
  ];

  const NavLink = ({ url, icon, label }: NavItem) => {
    return (
      <NextLink href={url} passHref>
        <Link variant="ghost" aria-label={label} fontSize="20px">
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

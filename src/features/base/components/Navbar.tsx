import {
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  useBreakpointValue,
  useDisclosure,
  Link,
  VStack,
  HStack,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Drawer,
} from "@chakra-ui/react";
import {
  DASHBOARD_URL,
  HOMEPAGE_URL,
  LOGIN_URL,
  PRICE_URL,
  REGISTER_URL,
} from "@/utils/urls";
import NextLink from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavItem } from "../types/NavItem";
import React from "react";
import { useAuth } from "@/features/Auth/hooks/useAuth";

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    url: HOMEPAGE_URL,
  },
  {
    label: "Price",
    url: PRICE_URL,
  },
];

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <>
      <HStack
        spacing="10"
        justify="space-between"
        color={"gray.600"}
        py={4}
        px={{ base: 5, md: 20 }}
        bg={"#F9FAFB"}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={"#F2F4F7"}
        as={"nav"}
        w={"100%"}
      >
        <Logo />
        {isDesktop && <DesktopNav />}
        {!isDesktop && (
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <FaTimes /> : <FaBars />}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        )}
      </HStack>
      {!isDesktop && (
        <Drawer isOpen={isOpen} placement="left" onClose={onToggle}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton color={"white"} />
              <DrawerBody>
                <MobileNav />
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      )}
    </>
  );
};

const NavLink = ({ label, url }: NavItem) => {
  return (
    <NextLink
      href={url}
      passHref
      style={{
        padding: "0.5rem",
        fontWeight: 500,
      }}
    >
      {label}
    </NextLink>
  );
};

const Logo = () => {
  return (
    <NextLink href={HOMEPAGE_URL} passHref>
      <Text
        color={"#101828"}
        _hover={{ textDecoration: "none" }}
        fontSize={"xl"}
      >
        Media Share
      </Text>
    </NextLink>
  );
};

const DesktopNav = () => {
  const auth = useAuth();

  return (
    <Flex justify="space-between" flex="1">
      <Stack
        ml={10}
        direction={"row"}
        spacing={4}
        color={"gray.600"}
        display={{ base: "none", md: "flex" }}
      >
        {NAV_ITEMS.map((navItem) => (
          <NavLink {...navItem} key={navItem.url} />
        ))}
      </Stack>
      {!auth.user && (
        <HStack spacing="6">
          <NextLink href={LOGIN_URL}>
            <Button fontWeight={400} variant={"link"}>
              Log In
            </Button>
          </NextLink>
          <NextLink href={REGISTER_URL}>
            <Button variant={"brand"}>Sign Up</Button>
          </NextLink>
        </HStack>
      )}
      {auth.user && (
        <NextLink href={DASHBOARD_URL}>
          <Button variant={"brand"}>Dashboard</Button>
        </NextLink>
      )}
    </Flex>
  );
};

const MobileNav = () => {
  return (
    <VStack p={4}>
      {NAV_ITEMS.map(({ label, url }: NavItem) => (
        <Text
          fontWeight={600}
          color={"gray.600"}
          py={2}
          align={"center"}
          key={url}
        >
          <NavLink label={label} url={url} />
        </Text>
      ))}
    </VStack>
  );
};
export default Navbar;

import {
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useBreakpointValue,
  useDisclosure,
  Link,
  VStack,
  HStack,
} from "@chakra-ui/react";
import {
  HOMEPAGE_URL,
  LOGIN_URL,
  PRICE_URL,
  REGISTER_URL,
} from "../../../utils/urls";
import NextLink from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

interface NavItem {
  label: string;
  url: string;
}

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

export default function Navbar() {
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
        {isDesktop ? (
          <DesktopNav />
        ) : (
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <FaTimes /> : <FaBars />}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        )}
      </HStack>
      <Collapse in={isOpen && !isDesktop} animateOpacity>
        <MobileNav />
      </Collapse>
    </>
  );
}

const NavLink = ({ label, url }: NavItem) => {
  return (
    <NextLink href={url} passHref>
      <Link
        p={2}
        fontWeight={500}
        _hover={{
          textDecoration: "none",
          color: "gray.500",
        }}
      >
        {label}
      </Link>
    </NextLink>
  );
};

const Logo = () => {
  return (
    <NextLink href={HOMEPAGE_URL} passHref>
      <Link
        color={"#101828"}
        _hover={{ textDecoration: "none" }}
        fontSize={"xl"}
      >
        Media Share
      </Link>
    </NextLink>
  );
};

const DesktopNav = () => {
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
          <NavLink {...navItem} />
        ))}
      </Stack>
      <HStack spacing="6">
        <NextLink href={LOGIN_URL}>
          <Button fontWeight={400} variant={"link"}>
            Log In
          </Button>
        </NextLink>
        <NextLink href={REGISTER_URL}>
          <Button
            fontWeight={600}
            color={"white"}
            bg={"#1A202C"}
            _hover={{
              bg: "#2a3448",
            }}
          >
            Sign Up
          </Button>
        </NextLink>
      </HStack>
    </Flex>
  );
};

const MobileNav = () => {
  return (
    <VStack p={4}>
      {NAV_ITEMS.map(({ label, url }: NavItem) => (
        <Text fontWeight={600} color={"gray.600"} py={2} align={"center"}>
          <NavLink label={label} url={url} />
        </Text>
      ))}
    </VStack>
  );
};

import React from "react";
import { NextPage } from "next";
import {
  Box,
  Heading,
  HStack,
  Link,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import LoginForm from "Auth/components/LoginForm";
import { HOMEPAGE_URL, REGISTER_URL } from "../utils/urls";
import NextLink from "next/link";

const Login: NextPage = () => {
  const [isMobileDevice] = useMediaQuery("(max-width: 900px)");

  const LoginSection = () => {
    return (
      <Box m={"auto"} mt={20} w={"70%"}>
        <Heading pb={10}>Sign in</Heading>
        <Box as={"section"} mb={50}>
          <Text fontSize={"xl"}>If you don’t have an account register</Text>

          <NextLink href={REGISTER_URL}>
            <a style={{ color: "#0C21C1", fontWeight: 600 }}>
              You can Register here!
            </a>
          </NextLink>
        </Box>

        <LoginForm />
      </Box>
    );
  };

  return (
    <Box
      background={
        isMobileDevice
          ? ""
          : "linear-gradient(to left, #1A202C 50%, white 50%);"
      }
      h={"100vh"}
      overflow={"auto"}
    >
      <NextLink href={HOMEPAGE_URL}>
        <Heading
          size={"lg"}
          fontWeight="bold"
          p={30}
          w={"fit-content"}
          cursor={"pointer"}
        >
          Media Share
        </Heading>
      </NextLink>

      {!isMobileDevice && (
        <HStack align={"start"}>
          <Box w={"50vw"}>
            <LoginSection />
          </Box>
          <Box w={"50vw"} as={"section"} color={"white"}>
            <Box w={"70%"} m={"auto"}>
              <img src={"share.svg"} alt={"Upload logo"} />
              <Heading mt={"60px"} fontSize={"5xl"}>
                Sign in to access
              </Heading>
              <Text mt={5} fontSize={"xl"}>
                Media Share
              </Text>
            </Box>
          </Box>
        </HStack>
      )}
      {isMobileDevice && <LoginSection />}
    </Box>
  );
};

export default Login;

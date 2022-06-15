import React from "react";
import BaseAuthPage from "../features/Auth/components/BaseAuthPage";
import { Box, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { LOGIN_URL } from "../utils/urls";
import RegisterForm from "../features/Auth/components/RegisterForm";
import { NextPage } from "next";

const Register: NextPage = () => {
  return (
    <BaseAuthPage title={"Register to access"}>
      <Box m={"auto"} mt={20} w={"70%"}>
        <Heading pb={10}>Sign in</Heading>
        <Box as={"section"} mb={50}>
          <Text fontSize={"xl"}>Already have an account?</Text>

          <NextLink href={LOGIN_URL}>
            <a style={{ color: "#0C21C1", fontWeight: 600 }}>Login</a>
          </NextLink>
        </Box>

        <RegisterForm />
      </Box>
    </BaseAuthPage>
  );
};

export default Register;

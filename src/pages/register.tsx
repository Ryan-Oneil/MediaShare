import React from "react";
import BaseAuthPage from "@/features/Auth/components/BaseAuthPage";
import { Box, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { LOGIN_URL } from "@/utils/urls";
import RegisterForm from "@/features/Auth/components/RegisterForm";
import { NextPage } from "next";

const Register: NextPage = () => {
  return (
    <BaseAuthPage title={"Register to access"}>
      <Box m={"auto"} mt={{ base: 2, "2xl": 20 }} w={"70%"}>
        <Heading pb={{ base: 5, "2xl": 10 }}>Sign in</Heading>
        <Box as={"section"} mb={{ base: 8, "2xl": 50 }}>
          <Text fontSize={"xl"}>Already have an account?</Text>

          <NextLink
            href={LOGIN_URL}
            style={{ color: "#0C21C1", fontWeight: 600 }}
          >
            Login
          </NextLink>
        </Box>

        <RegisterForm />
      </Box>
    </BaseAuthPage>
  );
};

export default Register;

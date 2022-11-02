import React from "react";
import BaseAuthPage from "@/features/Auth/components/BaseAuthPage";
import { Box, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { LOGIN_URL } from "@/utils/urls";
import ResetPasswordForm from "@/features/Auth/components/ResetPasswordForm";
import { NextPage } from "next";

const Reset: NextPage = () => {
  return (
    <BaseAuthPage title={"Reset password to access"}>
      <Box m={"auto"} mt={20} w={"70%"}>
        <Heading pb={10}>Reset Password</Heading>
        <Box as={"section"} mb={{ base: 2, "2xl": 20 }}>
          <Text fontSize={"xl"}>Remember your password?</Text>

          <NextLink href={LOGIN_URL}>
            <a style={{ color: "#0C21C1", fontWeight: 600 }}>Login</a>
          </NextLink>
        </Box>

        <ResetPasswordForm />
      </Box>
    </BaseAuthPage>
  );
};

export default Reset;

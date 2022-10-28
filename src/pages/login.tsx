import React, { useEffect } from "react";
import { NextPage } from "next";
import { Box, Heading, Text } from "@chakra-ui/react";
import LoginForm from "@/features/Auth/components/LoginForm";
import { DASHBOARD_URL, REGISTER_URL } from "@/utils/urls";
import NextLink from "next/link";
import BaseAuthPage from "@/features/Auth/components/BaseAuthPage";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(DASHBOARD_URL);
  }, []);

  return (
    <BaseAuthPage title={"Sign in to access"}>
      <Box m={"auto"} mt={{ base: 2, "2xl": 20 }} w={"70%"}>
        <Heading pb={{ base: 5, "2xl": 10 }}>Sign in</Heading>
        <Box as={"section"} mb={{ base: 8, "2xl": 50 }}>
          <Text fontSize={"xl"}>If you don’t have an account register</Text>

          <NextLink
            href={REGISTER_URL}
            style={{ color: "#0C21C1", fontWeight: 600 }}
          >
            You can Register here!
          </NextLink>
        </Box>

        <LoginForm />
      </Box>
    </BaseAuthPage>
  );
};

export default Login;

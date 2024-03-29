import React, { useEffect } from "react";
import { Box, Heading, HStack, Text, useMediaQuery } from "@chakra-ui/react";
import NextLink from "next/link";
import { DASHBOARD_URL, HOMEPAGE_URL } from "@/utils/urls";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import shareImage from "../../../../public/share.svg";

type props = {
  title: string;
  backgroundColor?: string;
  children: React.ReactNode;
  shouldRedirect?: boolean;
};

const BaseAuthPage = ({
  title,
  children,
  backgroundColor = "white",
  shouldRedirect = true,
}: props) => {
  const [isMobileDevice] = useMediaQuery("(max-width: 900px)");

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    const path = router.query.redirect as string;

    if (!auth.user || !shouldRedirect) {
      return;
    }

    if (path) {
      router.push(path);
    } else {
      router.replace(DASHBOARD_URL);
    }
  }, [auth]);

  return (
    <>
      <Head>
        <title>{title} - Media Share</title>
      </Head>
      <Box
        background={
          isMobileDevice
            ? backgroundColor
            : `linear-gradient(to left, #1A202C 50%, ${backgroundColor} 50%);`
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
            <Box w={"50vw"}>{children}</Box>
            <Box w={"50vw"} as={"section"} color={"white"}>
              <Box w={"70%"} m={"auto"}>
                <Image
                  src={shareImage}
                  alt={"Upload logo"}
                  width={600}
                  height={500}
                />
                <Heading
                  mt={{ base: 0, "2xl": "60px" }}
                  fontSize={{ base: "3xl", "2xl": "5xl" }}
                >
                  {title}
                </Heading>
                <Text mt={5} fontSize={"xl"}>
                  Media Share
                </Text>
              </Box>
            </Box>
          </HStack>
        )}
        {isMobileDevice && children}
      </Box>
    </>
  );
};

export default BaseAuthPage;

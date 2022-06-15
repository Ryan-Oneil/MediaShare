import React from "react";
import { Box, Heading, HStack, Text, useMediaQuery } from "@chakra-ui/react";
import NextLink from "next/link";
import { HOMEPAGE_URL } from "../../../utils/urls";

type props = {
  title: string;
  children: React.ReactNode;
};

const BaseAuthPage = ({ title, children }: props) => {
  const [isMobileDevice] = useMediaQuery("(max-width: 900px)");

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
          <Box w={"50vw"}>{children}</Box>
          <Box w={"50vw"} as={"section"} color={"white"}>
            <Box w={"70%"} m={"auto"}>
              <img src={"share.svg"} alt={"Upload logo"} />
              <Heading mt={"60px"} fontSize={"5xl"}>
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
  );
};

export default BaseAuthPage;

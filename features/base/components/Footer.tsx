import React from "react";
import { Flex, IconButton, Spacer, Text } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <Flex
      p={5}
      bg={"#1A202C"}
      color={"white"}
      as={"footer"}
      alignSelf={"flex-end"}
      w={"100%"}
    >
      <Text fontSize="sm" color="subtle" alignSelf={"center"}>
        &copy; {new Date().getFullYear()} MediaShare, Inc. All rights reserved.
      </Text>
      <Spacer />
      <IconButton
        as="a"
        href="https://github.com/Ryan-Oneil/MediaShare"
        aria-label="GitHub"
        variant="ghost"
        icon={<FaGithub fontSize="1.25rem" />}
      />
    </Flex>
  );
};

export default Footer;

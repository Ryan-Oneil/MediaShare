import { Box, useColorModeValue } from "@chakra-ui/react";
import React from "react";

export const Card = (props) => (
  <Box
    bg={useColorModeValue("white", "gray.700")}
    position="relative"
    px="6"
    pb="6"
    pt="16"
    overflow="hidden"
    shadow="lg"
    maxW="md"
    width="100%"
    {...props}
  />
);

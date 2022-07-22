import { Box, useColorModeValue, BoxProps } from "@chakra-ui/react";
import React from "react";

export const Card = (props: BoxProps) => (
  <Box
    bg={useColorModeValue("white", "gray.700")}
    position="relative"
    overflow="hidden"
    shadow="lg"
    maxW="md"
    width="100%"
    {...props}
  />
);

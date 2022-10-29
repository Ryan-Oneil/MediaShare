"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../../styles/chakra";

const Chakra = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

export default Chakra;

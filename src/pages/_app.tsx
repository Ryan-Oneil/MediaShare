import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "@/features/Auth/components/AuthProvider";
import { theme } from "../styles/chakra";

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;

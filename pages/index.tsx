import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../features/base/components/Navbar";
import {
  Button,
  Container,
  Heading,
  Stack,
  useBreakpointValue,
  Text,
  Box,
} from "@chakra-ui/react";
import { REGISTER_URL } from "../utils/urls";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Media Share - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as={"section"} bg={"#F9FAFB"}>
        <Navbar />
        <Container py={{ base: "16", md: "24" }} maxW="container.md">
          <Stack spacing={{ base: "8", md: "10" }} align="center">
            <Stack spacing={{ base: "4", md: "5" }} align="center">
              <Heading size={useBreakpointValue({ base: "xl", lg: "2xl" })}>
                Sharing media made simple
              </Heading>
              <Text color="muted" maxW="2xl" textAlign="center" fontSize="xl">
                Media share brings the ease to sharing files and media around
                the world. Hassle free! Supported by powerful APIs
              </Text>
            </Stack>

            <Link href={REGISTER_URL}>
              <Button
                size="lg"
                fontWeight={600}
                color={"white"}
                bg={"#1A202C"}
                _hover={{
                  bg: "#2a3448",
                }}
                w={"40%"}
                m={"auto"}
              >
                Try now
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>
    </div>
  );
};

export default Home;

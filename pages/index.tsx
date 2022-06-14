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
  VStack,
  Flex,
} from "@chakra-ui/react";
import { REGISTER_URL } from "../utils/urls";
import Link from "next/link";
import Image from "next/image";
import dashboardPicture from "../public/dashboardMock.png";
import Footer from "base/components/Footer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Media Share - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack as={"section"} bg={"#F9FAFB"} h={"100vh"}>
        <Navbar />
        <Container py={{ base: "16", md: "12" }} maxW="container.lg" flex={1}>
          <VStack spacing={{ base: "8", md: "10" }} align="center" mb={28}>
            <Stack spacing={{ base: "4", md: "5" }} align="center">
              <Heading size={useBreakpointValue({ base: "lg", lg: "2xl" })}>
                Sharing media made simple
              </Heading>
              <Text
                color="muted"
                maxW="2xl"
                textAlign="center"
                fontSize={useBreakpointValue({ base: "lg", lg: "2xl" })}
              >
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
          </VStack>
          <Image src={dashboardPicture} draggable={false} />
        </Container>
        <Footer />
      </VStack>
    </>
  );
};

export default Home;

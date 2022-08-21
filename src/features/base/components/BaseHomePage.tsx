import React from "react";
import Head from "next/head";
import { Container, VStack } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type props = {
  title: string;
  children: React.ReactNode;
};

const BaseHomePage = ({ title, children }: props) => {
  return (
    <>
      <Head>
        <title>{title} - Media Share</title>
        <link rel="icon" href="/public/favicon.ico" />
      </Head>
      <VStack as={"section"} bg={"#F9FAFB"} h={"100vh"} overflow={"auto"}>
        <Navbar />
        <Container py={{ base: "16", md: "5" }} maxW="container.lg" flex={1}>
          {children}
        </Container>
        <Footer />
      </VStack>
    </>
  );
};

export default BaseHomePage;

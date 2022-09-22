import React, { useState } from "react";
import {
  Box,
  BoxProps,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import { Sidebar } from "@/features/base/components/Sidebar";
import { FaBars } from "react-icons/fa";
import SettingDropDown from "./SettingDropDown";
import NotificationButton from "./NotificationButton";
import StorageStatus from "./StorageStatus";
import Head from "next/head";

interface BaseAppPageProps extends BoxProps {
  title: string;
  children: React.ReactNode;
  used: number;
  max: number;
}

const BaseAppPage = ({
  title,
  children,
  used,
  max,
  ...rest
}: BaseAppPageProps) => {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <Head>
        <title>{title} - Media Share</title>
      </Head>
      <Flex flexWrap={{ base: "wrap", md: "nowrap" }} minH={"100vh"}>
        <Sidebar display={{ base: "none", md: "block" }}>
          <StorageStatus used={used} max={max} />
        </Sidebar>
        <Flex w={"100%"} bg={"#FAFAFA"} h={"100vh"} flexDirection={"column"}>
          <Flex
            alignItems={"center"}
            as="nav"
            bg={"white"}
            boxShadow={"inset 0px -1px 0px #F1F1F1"}
            p={3}
          >
            <IconButton
              display={{ base: "inline-flex", md: "none" }}
              icon={<FaBars />}
              variant="outline"
              onClick={() => setShowDrawer(true)}
              aria-label={"Menu label"}
              mr={5}
            />
            <Heading size={"md"}>{title}</Heading>
            <Spacer />
            <NotificationButton />
            <SettingDropDown />
          </Flex>
          <Box as={"article"} {...rest} overflow={"auto"} h={"100%"}>
            {children}
          </Box>
        </Flex>
        {showDrawer && (
          <Drawer
            isOpen={showDrawer}
            placement="left"
            onClose={() => setShowDrawer(false)}
          >
            <DrawerOverlay>
              <DrawerContent>
                <DrawerCloseButton color={"white"} />
                <DrawerBody p={0}>
                  <Sidebar />
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        )}
      </Flex>
    </>
  );
};

export default BaseAppPage;

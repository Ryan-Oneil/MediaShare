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
import { Sidebar } from "../../base/components/Sidebar";
import { FaBars } from "react-icons/fa";
import UserDropDown from "./UserDropDown";
import NotificationButton from "./NotificationButton";

interface BaseAppPageProps extends BoxProps {
  title: string;
  children: React.ReactNode;
}

const BaseAppPage = (props: BaseAppPageProps) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const { title, children, ...rest } = props;

  return (
    <Flex flexWrap={{ base: "wrap", md: "nowrap" }} minH={"100vh"} >
      <Sidebar display={{ base: "none", md: "block" }} />
      <Flex w={"100%"} bg={"#FAFAFA"} h={"100vh"} flexDirection={"column"}>
        <Flex
          alignItems={"center"}
          as="nav"
          bg={"white"}
          boxShadow={"inset 0px -1px 0px #F1F1F1"}
          p={6}
        >
          <IconButton
            display={{ base: "inline-flex", md: "none" }}
            icon={<FaBars />}
            variant="outline"
            onClick={() => setShowDrawer(true)}
            aria-label={"Menu label"}
            mr={5}
          />
          <Heading size={"lg"}>{title}</Heading>
          <Spacer />
          <NotificationButton />
          <UserDropDown />
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
  );
};

export default BaseAppPage;

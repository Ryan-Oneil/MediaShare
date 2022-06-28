import React, { useState } from "react";
import {
  Box,
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

type props = {
  children: React.ReactNode;
};

const BaseAppPage = ({ children }: props) => {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <Flex flexWrap={{ base: "wrap", md: "nowrap" }} minH={"100vh"}>
      <Sidebar display={{ base: "none", md: "block" }} />
      <Box w={"100%"} bg={"#FAFAFA"}>
        <Flex
          alignItems={"center"}
          as="nav"
          bg={"white"}
          boxShadow={"sm"}
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
          <Heading size={"lg"}>Dashboard</Heading>
          <Spacer />
          <NotificationButton />
          <UserDropDown />
        </Flex>
        <Box as={"article"} p={{ base: 5, md: 10, xl: 20 }}>
          {children}
        </Box>
      </Box>
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

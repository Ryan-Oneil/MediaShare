import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Sidebar } from "../../features/base/components/Sidebar";

const Dashboard = () => {
  return (
    <Flex flexWrap={{ base: "wrap", md: "nowrap" }}>
      <Sidebar />
      <Box w={"100%"}>Test</Box>
    </Flex>
  );
};
export default Dashboard;

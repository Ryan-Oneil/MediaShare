import React from "react";
import BaseAppPage from "../../features/dashboard/components/BaseAppPage";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import FileCard from "../../features/fileshare/components/FileCard";
import RecentFileUploads from "../../features/dashboard/components/RecentFileUploads";

const Files = () => {
  return (
    <BaseAppPage title={"Shared Files"}>
      <Box as={"section"} p={5}>
        <Heading size={"md"}>Expiring Soon</Heading>
        <SimpleGrid
          spacing={6}
          py={4}
          minChildWidth={"80px"}
          templateRows={"auto"}
          autoRows={"0px"}
          overflow={"hidden"}
        >
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
        </SimpleGrid>
        <RecentFileUploads />
      </Box>
    </BaseAppPage>
  );
};

export default Files;

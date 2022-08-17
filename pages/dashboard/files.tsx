import React from "react";
import BaseAppPage from "../../features/dashboard/components/BaseAppPage";
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
} from "@chakra-ui/react";
import FileCard from "../../features/fileshare/components/FileCard";
import RecentFileUploads from "../../features/dashboard/components/RecentFileUploads";
import { GetServerSidePropsContext } from "next";
import { getUserFromRequest } from "../../features/Auth/FirebaseAdmin";
import User from "../../lib/mongoose/model/User";
import { SharedLink } from "../../features/dashboard/types/SharedFile";
import dbConnect from "../../lib/mongoose";
import { FaShareAlt } from "react-icons/fa";
import { Storage } from "../../features/dashboard/types/DashboardUser";
import { getUserById } from "../../lib/services/userService";

const Files = ({
  sharedLinks,
  storage,
}: {
  sharedLinks: [SharedLink];
  storage: Storage;
}) => {
  return (
    <BaseAppPage
      title={"Shared Files"}
      used={storage.usedTotal}
      max={storage.max}
    >
      <Box as={"section"} p={5}>
        <Heading size={"sm"}>Expiring Soon</Heading>
        <SimpleGrid
          spacingX={4}
          pt={4}
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
        <Flex pb={4} alignItems={"baseline"}>
          <Heading size={"sm"}>Recent file shares</Heading>
          <Spacer />
          <Button leftIcon={<FaShareAlt />}>Share Files</Button>
        </Flex>
        <RecentFileUploads links={sharedLinks} />
      </Box>
    </BaseAppPage>
  );
};

export default Files;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const uid = await getUserFromRequest(context);

  const user = await getUserById(uid, "storage sharedLinks");

  return {
    props: {
      sharedLinks: JSON.parse(JSON.stringify(user.sharedLinks)),
      storage: user.storage,
    },
  };
};

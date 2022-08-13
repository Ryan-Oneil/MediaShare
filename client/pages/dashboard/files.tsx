import React from "react";
import BaseAppPage from "../../features/dashboard/components/BaseAppPage";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import FileCard from "../../features/fileshare/components/FileCard";
import RecentFileUploads from "../../features/dashboard/components/RecentFileUploads";
import { GetServerSidePropsContext } from "next";
import { getUserFromRequest } from "../../features/Auth/FirebaseAdmin";
import User from "../../lib/mongoose/model/User";
import { SharedLink } from "../../features/dashboard/types/SharedFile";
import dbConnect from "../../lib/mongoose";

const Files = ({ sharedLinks }: { sharedLinks: [SharedLink] }) => {
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

  await dbConnect();

  const user = await User.findOne({ externalId: uid }, "sharedLinks")
    .lean()
    .exec();

  return {
    props: {
      sharedLinks: JSON.parse(JSON.stringify(user.sharedLinks)),
    },
  };
};

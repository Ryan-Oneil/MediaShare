import React from "react";
import BaseAppPage from "@/features/dashboard/components/BaseAppPage";
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
} from "@chakra-ui/react";
import FileCard from "@/features/fileshare/components/FileCard";
import RecentFileUploads from "@/features/dashboard/components/RecentFileUploads";
import { GetServerSidePropsContext } from "next";
import { SharedLink } from "@/features/dashboard/types/SharedFile";
import { Storage } from "@/features/dashboard/types/DashboardUser";
import { getUserById } from "@/lib/services/userService";
import { FiShare2 } from "react-icons/fi";
import {
  getUserIdFromJWT,
  withAuthentication,
} from "@/lib/firebase/wrapperUtils";

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
          <Button
            leftIcon={<FiShare2 />}
            bg={"brand.100"}
            color={"white"}
            _hover={{ bg: "brand.200" }}
            _active={{ bg: "brand.100" }}
          >
            Share Files
          </Button>
        </Flex>
        <RecentFileUploads links={sharedLinks} />
      </Box>
    </BaseAppPage>
  );
};

export default Files;

export const getServerSideProps = withAuthentication(
  async ({ req }: GetServerSidePropsContext) => {
    const uid = await getUserIdFromJWT(req.cookies.jwt);

    const user = await getUserById(uid, "storage sharedLinks");

    return {
      props: {
        sharedLinks: JSON.parse(JSON.stringify(user.sharedLinks)),
        storage: user.storage,
      },
    };
  }
);

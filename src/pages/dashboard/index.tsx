import React from "react";

import BaseAppPage from "@/features/dashboard/components/BaseAppPage";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import StatCard from "@/features/dashboard/components/StatCard";
import CurrentPlanCard from "@/features/dashboard/components/CurrentPlanCard";
import { GetServerSidePropsContext } from "next";
import { DashboardUser } from "@/features/dashboard/types/DashboardUser";
import { displayBytesInReadableForm } from "@/utils/helpers";
import MediaCard from "@/features/gallery/components/MediaCard";
import { getUserById } from "@/lib/services/userService";
import RecentFileUploads from "@/features/dashboard/components/RecentFileUploads";
import {
  getUserIdFromJWT,
  withAuthentication,
} from "@/lib/firebase/wrapperUtils";
import {
  deleteUsersExpiredSharedLinks,
  isLinkExpired,
} from "@/lib/services/fileshareService";
import EmptyPlaceHolder from "@/features/base/components/EmptyPlaceHolder";

const Dashboard = ({ storage, medias, sharedLinks }: DashboardUser) => {
  return (
    <BaseAppPage
      title={"Dashboard"}
      p={{ base: 5, md: 10, "2xl": 12 }}
      used={storage.usedTotal}
      max={storage.max}
    >
      <Flex as={"section"} gap={5} flexWrap={"wrap"}>
        <Flex
          direction={"column"}
          flex={1}
          gap={5}
          maxW={"-webkit-fill-available"}
        >
          <Flex
            justifyContent={"space-between"}
            direction={["column", "row"]}
            gap={5}
          >
            <StatCard
              title={"Image Storage"}
              value={displayBytesInReadableForm(storage.imageUsed)}
            />
            <StatCard
              title={"Video Storage"}
              value={displayBytesInReadableForm(storage.videoUsed)}
            />
            <StatCard
              title={"Document Storage"}
              value={displayBytesInReadableForm(storage.documentUsed)}
            />
          </Flex>
          <Heading size={"md"}>Recent Uploads</Heading>
          <Stack gap={6} direction={["column", "row"]} maxH={200}>
            {medias.slice(0, 5).map((media) => (
              <MediaCard media={media} showControls={false} key={media._id} />
            ))}
            {medias.length < 1 && (
              <EmptyPlaceHolder description={"No recent Uploads"} />
            )}
          </Stack>
          <Heading size={"md"}>Recent File shares</Heading>
          <Box overflow={"auto"} maxH={"50vh"}>
            <RecentFileUploads links={sharedLinks} />
          </Box>
        </Flex>
        <CurrentPlanCard />
      </Flex>
    </BaseAppPage>
  );
};
export default Dashboard;

export const getServerSideProps = withAuthentication(
  async ({ req }: GetServerSidePropsContext) => {
    const uid = await getUserIdFromJWT(req.cookies.jwt);
    const user = await getUserById(uid, "storage medias sharedLinks");

    deleteUsersExpiredSharedLinks(uid);

    return {
      props: {
        storage: user.storage,
        medias: JSON.parse(JSON.stringify(user.medias)),
        sharedLinks: JSON.parse(
          JSON.stringify(
            user.sharedLinks.filter(
              (link) => link.files.length > 0 && !isLinkExpired(link)
            )
          )
        ),
      },
    };
  }
);

import React from "react";

import BaseAppPage from "../../features/dashboard/components/BaseAppPage";
import { Flex, Heading, Stack } from "@chakra-ui/react";
import StatCard from "../../features/dashboard/components/StatCard";
import CurrentPlanCard from "../../features/dashboard/components/CurrentPlanCard";
import RecentFileUploads from "dashboard/components/RecentFileUploads";
import { GetServerSidePropsContext } from "next";
import { getUserFromRequest } from "../../features/Auth/FirebaseAdmin";
import dbConnect from "../../lib/mongoose";
import User from "../../lib/mongoose/model/User";
import { DashboardUser } from "../../features/dashboard/types/DashboardUser";
import { displayBytesInReadableForm } from "../../utils/helpers";
import MediaCard from "../../features/gallery/components/MediaCard";

const Dashboard = ({ storage, medias, sharedLinks }: DashboardUser) => {
  return (
    <BaseAppPage
      title={"Dashboard"}
      p={{ base: 5, md: 10, "2xl": 20 }}
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
              description={"40% vs last month"}
            />
            <StatCard
              title={"Video Storage"}
              value={displayBytesInReadableForm(storage.videoUsed)}
              description={"40% vs last month"}
            />
            <StatCard
              title={"Document Storage"}
              value={displayBytesInReadableForm(storage.documentUsed)}
              description={"40% vs last month"}
            />
          </Flex>
          <Heading size={"md"}>Recent Uploads</Heading>
          <Stack gap={6} direction={["column", "row"]}>
            {medias.map((media) => (
              <MediaCard media={media} showControls={false} key={media.id} />
            ))}
          </Stack>
          <RecentFileUploads links={sharedLinks} />
        </Flex>
        <CurrentPlanCard />
      </Flex>
    </BaseAppPage>
  );
};
export default Dashboard;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const uid = await getUserFromRequest(context);

  await dbConnect();

  const user = await User.findOne(
    { externalId: uid },
    "storage medias sharedLinks"
  )
    .lean()
    .exec();

  return {
    props: {
      storage: user.storage,
      medias: user.medias,
      sharedLinks: JSON.parse(JSON.stringify(user.sharedLinks)),
    },
  };
};

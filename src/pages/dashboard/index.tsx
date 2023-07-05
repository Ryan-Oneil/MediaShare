import React from "react";

import BaseAppPage from "@/features/dashboard/components/BaseAppPage";
import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import StatCard from "@/features/dashboard/components/StatCard";
import CurrentPlanCard from "@/features/dashboard/components/CurrentPlanCard";
import { GetServerSidePropsContext } from "next";
import { DashboardUser } from "@/features/dashboard/types/DashboardUser";
import { displayBytesInReadableForm } from "@/utils/helpers";
import { getSubscriptionPlan, getUserById } from "@/lib/services/userService";
import RecentFileUploads from "@/features/dashboard/components/RecentFileUploads";
import {
  getUserIdFromJWT,
  withAuthentication,
} from "@/lib/firebase/wrapperUtils";
import {
  deleteUsersExpiredSharedLinks,
  isLinkExpired,
} from "@/lib/services/fileshareService";
import StorageDetail from "@/features/dashboard/components/StorageDetail";
import RecentMediaUploads from "@/features/dashboard/components/RecentMediaUploads";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";

const Dashboard = ({ storage, medias, sharedLinks, plan }: DashboardUser) => {
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
              title={"Shared Files Storage"}
              value={displayBytesInReadableForm(storage.documentUsed)}
            />
          </Flex>
          <Heading size={"md"}>Recent Media Uploads</Heading>
          <RecentMediaUploads medias={medias} />

          <Box overflow={"auto"} maxH={"50vh"}>
            <RecentFileUploads links={sharedLinks} />
          </Box>
        </Flex>
        <VStack>
          <StorageDetail {...storage} />
          <CurrentPlanCard {...plan} />
        </VStack>
      </Flex>
    </BaseAppPage>
  );
};
export default Dashboard;

export const getServerSideProps = withAuthentication(
  async ({ req }: GetServerSidePropsContext) => {
    const uid = await getUserIdFromJWT(req.cookies.jwt);

    const user = JSON.parse(
      JSON.stringify(
        await getUserById(uid, "storage medias sharedLinks subscription")
      )
    );
    deleteUsersExpiredSharedLinks(uid);

    const currentPlan = await getSubscriptionPlan(
      user.subscription?.planId || "none"
    );

    return {
      props: {
        storage: user.storage,
        medias: user.medias,
        sharedLinks: user.sharedLinks.filter(
          (link: ISharedLink) => link.files.length > 0 && !isLinkExpired(link)
        ),
        plan: currentPlan,
      },
    };
  }
);

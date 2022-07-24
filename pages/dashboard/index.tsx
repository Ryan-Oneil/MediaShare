import React from "react";

import BaseAppPage from "../../features/dashboard/components/BaseAppPage";
import { Flex, Heading, Image, Stack } from "@chakra-ui/react";
import StatCard from "../../features/dashboard/components/StatCard";
import { Card } from "../../features/base/components/Card";
import StorageDetailCard from "../../features/dashboard/components/StorageDetailCard";
import RecentFileUploads from "dashboard/components/RecentFileUploads";
import { GetServerSidePropsContext } from "next";
import { LOGIN_URL } from "../../utils/urls";
import { getFirebaseAdmin } from "../../features/Auth/FirebaseAdmin";

const Dashboard = () => {
  return (
    <BaseAppPage title={"Dashboard"} p={{ base: 5, md: 10, xl: 20 }}>
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
              value={"200MB"}
              description={"40% vs last month"}
            />
            <StatCard
              title={"Video Storage"}
              value={"200MB"}
              description={"40% vs last month"}
            />
            <StatCard
              title={"Document Storage"}
              value={"200MB"}
              description={"40% vs last month"}
            />
          </Flex>
          <Heading size={"md"}>Recent Media</Heading>
          <Stack gap={6} direction={["column", "row"]}>
            <Card w={"auto"} rounded={10}>
              <Image
                src={"https://via.placeholder.com/800.png"}
                objectFit="cover"
                maxH={{ base: "100%", md: "250px" }}
              />
            </Card>
            <Card w={"auto"} rounded={10}>
              <Image
                src={"https://via.placeholder.com/800.png"}
                objectFit="cover"
                maxH={{ base: "100%", md: "250px" }}
              />
            </Card>
            <Card w={"auto"} rounded={10}>
              <Image
                src={"https://via.placeholder.com/800.png"}
                objectFit="cover"
                maxH={{ base: "100%", md: "250px" }}
              />
            </Card>
            <Card w={"auto"} rounded={10}>
              <Image
                src={"https://via.placeholder.com/800.png"}
                objectFit="cover"
                maxH={{ base: "100%", md: "250px" }}
              />
            </Card>
            <Card w={"auto"} rounded={10}>
              <Image
                src={"https://via.placeholder.com/800.png"}
                objectFit="cover"
                maxH={{ base: "100%", md: "250px" }}
              />
            </Card>
            <Card w={"auto"} rounded={10}>
              <Image
                src={"https://via.placeholder.com/800.png"}
                objectFit="cover"
                maxH={{ base: "100%", md: "250px" }}
              />
            </Card>
          </Stack>
          <RecentFileUploads />
        </Flex>
        <StorageDetailCard />
      </Flex>
    </BaseAppPage>
  );
};
export default Dashboard;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const cookies = context.req.cookies;
    const token = await getFirebaseAdmin().auth().verifyIdToken(cookies.jwt);

    const { uid } = token;

    return {
      props: { uid },
    };
  } catch (err) {
    context.res.writeHead(302, { Location: LOGIN_URL });
    context.res.end();

    return { props: {} };
  }
};

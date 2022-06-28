import React from "react";

import BaseAppPage from "../../features/dashboard/components/BaseAppPage";
import { Flex, Image, Stack } from "@chakra-ui/react";
import StatCard from "../../features/dashboard/components/StatCard";
import { Card } from "../../features/base/components/Card";
import StorageDetailCard from "../../features/dashboard/components/StorageDetailCard";
import RecentUploads from "dashboard/components/RecentUploads";

const Dashboard = () => {
  return (
    <BaseAppPage>
      <Flex as={"section"} gap={5} mt={5} flexWrap={"wrap"}>
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
          <Stack gap={6} direction={["column", "row"]}>
            <Card w={"auto"}>
              <Image
                src={"https://via.placeholder.com/800.png"}
                objectFit="cover"
                maxH={{ base: "100%", md: "250px" }}
              />
            </Card>
            <Card w={"auto"}>
              <Image
                src={"https://via.placeholder.com/800.png"}
                objectFit="cover"
                maxH={{ base: "100%", md: "250px" }}
              />
            </Card>
            <Card w={"auto"}>
              <Image
                src={"https://via.placeholder.com/800.png"}
                objectFit="cover"
                maxH={{ base: "100%", md: "250px" }}
              />
            </Card>
          </Stack>
          <RecentUploads />
        </Flex>
        <StorageDetailCard />
      </Flex>
    </BaseAppPage>
  );
};
export default Dashboard;

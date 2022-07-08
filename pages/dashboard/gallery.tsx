import React from "react";
import BaseAppPage from "../../features/dashboard/components/BaseAppPage";
import { Button, Flex, Input, Spacer } from "@chakra-ui/react";

const Gallery = () => {
  return (
    <BaseAppPage title={"Gallery"}>
      <Flex p={5} bg={"white"} gap={5} boxShadow={"inset 0px -1px 0px #F1F1F1"}>
        <Button variant="outline" rounded={"full"}>
          Upload
        </Button>
        <Input placeholder={"Search name"} width="auto" rounded={"full"} />
        <Spacer />
        <Button width={100} rounded={"full"} variant="outline">
          Sort
        </Button>
      </Flex>
    </BaseAppPage>
  );
};

export default Gallery;

import React from "react";
import { Button, Flex, Icon, Progress, Text, VStack } from "@chakra-ui/react";
import { AiOutlineCloudServer } from "react-icons/ai";
import { displayBytesInReadableForm } from "../../../utils/helpers";

type storageProps = {
  used: number;
  max: number;
};

const StorageStatus = ({ used, max }: storageProps) => {
  const percentageUsed = (used / max) * 100;
  return (
    <VStack
      as={"section"}
      color={"white"}
      mt={"auto!important"}
      mb={"5px!important"}
      fontSize={"xs"}
    >
      <Flex align="center">
        <Icon as={AiOutlineCloudServer} mr={2} fontSize={"lg"} />
        Storage
      </Flex>
      <Progress
        value={percentageUsed}
        colorScheme={"gray"}
        w={"80%"}
        size={"xs"}
        rounded={"full"}
      />
      <Text>
        {displayBytesInReadableForm(used)} of {displayBytesInReadableForm(max)}{" "}
        used
      </Text>
      <Button
        variant="outline"
        aria-label={"Upgrade Plan"}
        _hover={{
          bg: "brand.200",
        }}
        fontSize={"xs"}
        size={"xs"}
      >
        Upgrade
      </Button>
    </VStack>
  );
};

export default StorageStatus;

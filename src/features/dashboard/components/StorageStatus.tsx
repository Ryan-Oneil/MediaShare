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
  const size = { base: "xs", "2xl": "md" };

  return (
    <VStack
      as={"section"}
      color={"white"}
      mt={"auto!important"}
      mb={"5px!important"}
      fontSize={size}
    >
      <Flex align="center" fontSize={"lg"}>
        <Icon as={AiOutlineCloudServer} mr={2} />
        Storage
      </Flex>
      <Progress
        value={percentageUsed}
        colorScheme={"gray"}
        w={"100%"}
        size={{ base: "xs", "2xl": "sm" }}
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
        fontSize={size}
        size={size}
      >
        Upgrade
      </Button>
    </VStack>
  );
};

export default StorageStatus;

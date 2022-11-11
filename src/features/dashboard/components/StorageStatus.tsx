import React from "react";
import { Button, Flex, Icon, Progress, Text, VStack } from "@chakra-ui/react";
import { AiOutlineCloudServer } from "react-icons/ai";
import { displayBytesInReadableForm } from "@/utils/helpers";
import { useRouter } from "next/router";

type storageProps = {
  used: number;
  max: number;
};

const StorageStatus = ({ used, max }: storageProps) => {
  const percentageUsed = (used / max) * 100;
  const size = { base: "xs", "2xl": "md" };
  const router = useRouter();

  return (
    <VStack
      as={"section"}
      color={"white"}
      mt={"auto!important"}
      mb={"20px!important"}
      fontSize={size}
      gap={1}
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
        _active={{
          bg: "brand.100",
        }}
        fontSize={size}
        size={size}
        onClick={() => router.push("/price")}
      >
        Upgrade
      </Button>
    </VStack>
  );
};

export default StorageStatus;

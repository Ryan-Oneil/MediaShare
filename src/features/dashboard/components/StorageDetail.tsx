import React from "react";
import { MdOutlineCloudDone } from "react-icons/md";
import { Box, Flex, Icon, Progress, Text } from "@chakra-ui/react";
import { Card } from "@/features/base/components/Card";
import { IQuota } from "@/lib/mongoose/model/User";
import { displayBytesInReadableForm } from "@/utils/helpers";

const StorageDetail = ({ usedTotal, max }: IQuota) => {
  const percentage = (usedTotal / max) * 100;
  return (
    <Card
      mb={{ base: "0px", lg: "20px" }}
      alignItems="center"
      p={6}
      rounded={10}
    >
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        borderRadius={"50%"}
        mx="auto"
        h="100px"
        w="100px"
        bg={"#F4F7FE"}
      >
        <Icon as={MdOutlineCloudDone} color={"brand"} h="46px" w="46px" />
      </Flex>
      <Text fontWeight="bold" fontSize="2xl" mt="10px">
        Storage
      </Text>
      <Text
        color={"gray.600"}
        fontSize="md"
        maxW={{ base: "100%", xl: "80%", "3xl": "60%" }}
        mx="auto"
      >
        {percentage > 80
          ? "You are running out of storage. Consider upgrading your plan or deleting media."
          : "You have plenty of storage. Keep on uploading worry free!"}
      </Text>
      <Box w="100%" mt={4}>
        <Flex w="100%" justify="space-between" mb="10px">
          <Text color={"gray.400"} fontSize="sm" maxW="40%">
            {displayBytesInReadableForm(usedTotal)}
          </Text>
          <Text color={"gray.400"} fontSize="sm" maxW="40%">
            {displayBytesInReadableForm(max)}
          </Text>
        </Flex>
        <Progress
          alignItems="start"
          colorScheme="brandScheme"
          value={percentage}
          w="100%"
        />
      </Box>
    </Card>
  );
};

export default StorageDetail;

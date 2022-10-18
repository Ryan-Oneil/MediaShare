import React from "react";
import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import FileIcon from "@/features/fileshare/components/FileIcon";
import { displayBytesInReadableForm } from "@/utils/helpers";
import { FaTrash } from "react-icons/fa";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";

const FileDetail = ({ name, contentType, size }: UploadedItem) => {
  return (
    <Flex as={"li"} gap={5} w={"100%"} alignItems={"center"}>
      <FileIcon type={contentType} name={name} />
      <Box minW={0} flex={1} as={"section"}>
        <Heading size={"md"} noOfLines={1}>
          {name}
        </Heading>
        <Text color={"rgba(0, 0, 0, 0.4)"} fontWeight={"700"}>
          {contentType} - {displayBytesInReadableForm(size)}
        </Text>
      </Box>
      <IconButton
        aria-label={"Delete"}
        icon={<FaTrash color={"red"} />}
        variant={"ghost"}
      />
    </Flex>
  );
};
export default FileDetail;

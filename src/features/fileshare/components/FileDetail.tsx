import React from "react";
import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import FileIcon from "@/features/fileshare/components/FileIcon";
import { displayBytesInReadableForm } from "@/utils/helpers";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";

interface FileDetailProps extends UploadedItem {
  children?: React.ReactNode;
}

const FileDetail = ({
  name,
  contentType,
  size,
  children,
  ...rest
}: FileDetailProps) => {
  return (
    <Flex as={"li"} gap={5} w={"100%"} alignItems={"center"}>
      <FileIcon contentType={contentType} name={name} size={size} {...rest} />
      <Box minW={0} flex={1} as={"section"}>
        <Heading size={"md"} noOfLines={1}>
          {name}
        </Heading>
        <Text color={"rgba(0, 0, 0, 0.4)"} fontWeight={"700"} fontSize={"sm"}>
          {contentType} - {displayBytesInReadableForm(size)}
        </Text>
      </Box>
      {children}
    </Flex>
  );
};
export default FileDetail;

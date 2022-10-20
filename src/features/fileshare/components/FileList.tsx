import React from "react";
import {
  Box,
  List,
  ListItem,
  Text,
  HStack,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { FaRegFileAlt } from "react-icons/fa";
import { ImDownload3 } from "react-icons/im";
import { displayBytesInReadableForm } from "@/utils/helpers";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";

const FileList = ({ files }: ISharedLink) => {
  return (
    <List spacing={5}>
      {files.map((file: UploadedItem) => (
        <FileDetail key={file.name} {...file} />
      ))}
    </List>
  );
};

const FileDetail = ({ name, size, contentType }: UploadedItem) => {
  return (
    <ListItem>
      <HStack as={"section"}>
        <Box
          bg={"#EBF8FF"}
          color={"#4299E1"}
          w={"fit-content"}
          p={2}
          rounded={"lg"}
        >
          <FaRegFileAlt size={24} />
        </Box>
        <VStack spacing={0} alignItems={"start"}>
          <Text>{name}</Text>
          <Text fontSize={"xs"} color={"rgba(0, 0, 0, 0.4)"}>
            {contentType} - {displayBytesInReadableForm(size)}
          </Text>
        </VStack>
        <IconButton
          aria-label={"Download file"}
          ml={"auto!important"}
          icon={<ImDownload3 />}
        />
      </HStack>
    </ListItem>
  );
};

export default FileList;

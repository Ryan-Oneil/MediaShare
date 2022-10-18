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

const FileList = () => {
  return (
    <List spacing={5}>
      <FileDetail name={"Example.docx"} contentType={"DOC"} size={12312412} />
      <FileDetail name={"Example.docx"} contentType={"DOC"} size={12312412} />
      <FileDetail name={"Example.docx"} contentType={"DOC"} size={12312412} />
      <FileDetail name={"Example.docx"} contentType={"DOC"} size={12312412} />
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

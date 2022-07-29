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
import { displayBytesInReadableForm } from "../../../utils/helpers";

type FileProps = {
  filename: string;
  size: number;
  fileType: string;
};

const FileList = () => {
  return (
    <List spacing={5}>
      <FileDetail filename={"Example.docx"} fileType={"DOC"} size={12312412} />
      <FileDetail filename={"Example.docx"} fileType={"DOC"} size={12312412} />
      <FileDetail filename={"Example.docx"} fileType={"DOC"} size={12312412} />
      <FileDetail filename={"Example.docx"} fileType={"DOC"} size={12312412} />
    </List>
  );
};

const FileDetail = ({ filename, size, fileType }: FileProps) => {
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
          <Text>{filename}</Text>
          <Text fontSize={"xs"} color={"rgba(0, 0, 0, 0.4)"}>
            {fileType} - {displayBytesInReadableForm(size)}
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

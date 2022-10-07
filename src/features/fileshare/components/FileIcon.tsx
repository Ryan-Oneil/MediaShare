import React from "react";
import { Center, Circle, Tooltip } from "@chakra-ui/react";
import { AiOutlineFileExcel } from "react-icons/ai";

type FileIconProps = {
  type: string;
  fileName: string;
};

const FileIcon = ({ type, fileName }: FileIconProps) => {
  return (
    <Tooltip label={fileName}>
      <Center color="white" bg={"green"} p={2} rounded={12}>
        <AiOutlineFileExcel fontSize={32} />
      </Center>
    </Tooltip>
  );
};

export default FileIcon;

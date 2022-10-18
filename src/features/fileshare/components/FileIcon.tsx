import React from "react";
import { Center, Circle, Tooltip } from "@chakra-ui/react";
import { AiOutlineFileExcel } from "react-icons/ai";

type FileIconProps = {
  type: string;
  name: string;
};

const FileIcon = ({ type, name }: FileIconProps) => {
  return (
    <Tooltip label={name}>
      <Center
        color="white"
        bg={"green"}
        p={2}
        rounded={12}
        h={"fit-content"}
        w={"fit-content"}
      >
        <AiOutlineFileExcel fontSize={32} />
      </Center>
    </Tooltip>
  );
};

export default FileIcon;

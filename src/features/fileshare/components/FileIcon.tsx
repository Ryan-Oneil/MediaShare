import React from "react";
import { Center, Tooltip } from "@chakra-ui/react";
import Media from "@/features/gallery/components/Media";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";
import { AiOutlineFileText } from "react-icons/ai";

const FileIcon = ({ contentType, name, url }: UploadedItem) => {
  if (contentType.includes("image") || contentType.includes("video")) {
    return <Media src={url} contentType={contentType} w={12} h={12} />;
  }

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
        <AiOutlineFileText fontSize={32} />
      </Center>
    </Tooltip>
  );
};

export default FileIcon;

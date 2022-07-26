import React from "react";
import { Card } from "../../base/components/Card";
import Image from "next/image";
import { Text } from "@chakra-ui/react";

const FileCard = () => {
  return (
    <Card
      width={"fill-content"}
      p={2}
      rounded={10}
      _hover={{ shadow: "2xl", cursor: "pointer" }}
    >
      <Image
        src={"/folder.svg"}
        alt={"Folder image"}
        height={90}
        width={90}
        draggable={false}
      />
      <Text fontSize={"sm"} textAlign={"center"}>
        In 2 hours
      </Text>
    </Card>
  );
};

export default FileCard;

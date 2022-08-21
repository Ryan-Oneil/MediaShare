import React from "react";
import { Card } from "@/features/base/components/Card";
import Image from "next/image";
import { Link, Text } from "@chakra-ui/react";
import { FILE_SHARE_URL } from "../../../utils/urls";
import NextLink from "next/link";

const FileCard = () => {
  return (
    <NextLink href={FILE_SHARE_URL + "/5"} passHref>
      <Link>
        <Card
          width={"fill-content"}
          p={1}
          mb={4}
          rounded={10}
          _hover={{ shadow: "2xl", cursor: "pointer" }}
        >
          <Image
            src={"/folder.svg"}
            alt={"Folder image"}
            height={60}
            width={"100%"}
            draggable={false}
          />
          <Text fontSize={"sm"} textAlign={"center"} mt={-1}>
            In 2 hours
          </Text>
        </Card>
      </Link>
    </NextLink>
  );
};

export default FileCard;

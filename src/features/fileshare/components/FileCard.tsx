import React from "react";
import { Card } from "@/features/base/components/Card";
import Image from "next/image";
import {
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FILE_SHARE_URL, HOMEPAGE_URL } from "@/utils/urls";
import NextLink from "next/link";
import { SharedFile, SharedLink } from "@/features/dashboard/types/SharedFile";
import FileIcon from "@/features/fileshare/components/FileIcon";
import { displayBytesInReadableForm } from "@/utils/helpers";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaEye, FaLink, FaTrash } from "react-icons/fa";

interface FileCardProps extends SharedLink {
  onClick?: () => void;
}

const FileCard = ({ title, size, expires, files, onClick }: FileCardProps) => {
  return (
    <Card
      width={"fit-content"}
      mb={4}
      rounded={10}
      _hover={{ shadow: "2xl", cursor: "pointer" }}
      as={"article"}
      onClick={onClick}
    >
      <VStack gap={2}>
        <SimpleGrid columns={4} gap={4} p={4}>
          {files.map((file: SharedFile) => (
            <FileIcon type={file.type} fileName={file.name} />
          ))}
        </SimpleGrid>
        <Container>
          <Heading size={"md"}>{title}</Heading>
          <Text color={"rgba(0, 0, 0, 0.4)"} fontWeight={"700"}>
            Expires in {expires}
          </Text>
        </Container>
        <Flex bg={"#F0F0F0"} w={"100%"} p={4} alignItems={"center"}>
          <Text fontWeight={"bold"}>{displayBytesInReadableForm(size)}</Text>
          <Spacer />
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<HiOutlineDotsVertical size={26} />}
              variant={"ghost"}
            />
            <MenuList>
              <MenuItem icon={<FaEye />}>View</MenuItem>
              <MenuItem icon={<FaLink />}>Copy Link</MenuItem>
              <MenuItem icon={<FaTrash color={"red"} />}>Delete</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </VStack>
    </Card>
  );
};

export default FileCard;

import React from "react";
import { Card } from "@/features/base/components/Card";
import {
  Center,
  Container,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FILE_SHARE_URL } from "@/utils/urls";
import FileIcon from "@/features/fileshare/components/FileIcon";
import { displayBytesInReadableForm } from "@/utils/helpers";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaEye, FaLink, FaTrash } from "react-icons/fa";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";
import { useRouter } from "next/router";
import useCopyLink from "@/features/fileshare/hooks/useCopyLink";

interface FileCardProps extends ISharedLink {
  onClick?: () => void;
  onDelete: () => void;
}

const FileCard = ({
  title,
  size,
  expires,
  files,
  onClick,
  _id,
  onDelete,
}: FileCardProps) => {
  const { onCopy } = useCopyLink(_id);
  const router = useRouter();

  return (
    <Card
      width={"fit-content"}
      mb={4}
      rounded={10}
      _hover={{ shadow: "2xl", cursor: "pointer" }}
      as={"article"}
      onClick={onClick}
    >
      <VStack gap={2} h={"100%"}>
        <SimpleGrid columns={4} gap={4} p={4}>
          {files.slice(0, 7).map((file: UploadedItem) => (
            <FileIcon key={_id + file.name} {...file} />
          ))}
          {files.length > 7 && (
            <Center
              bg={"#F0F0F0"}
              p={2}
              rounded={12}
              m={"auto"}
              fontWeight={"bold"}
            >
              {`+${files.length - 7}`}
            </Center>
          )}
        </SimpleGrid>
        <Container mt={"auto!important"}>
          <Heading size={"md"}>{title ? title : "Untitled"}</Heading>
          <Text color={"rgba(0, 0, 0, 0.4)"} fontWeight={"700"}>
            {expires
              ? `Expires on ${new Date(expires).toLocaleDateString()}`
              : " Never Expires"}
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
              onClick={(e) => e.stopPropagation()}
            />
            <MenuList>
              <MenuItem
                icon={<FaEye />}
                onClick={() => router.push(`${FILE_SHARE_URL}/${_id}`)}
              >
                View
              </MenuItem>
              <MenuItem
                icon={<FaLink />}
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy();
                }}
              >
                Copy Link
              </MenuItem>
              <MenuItem
                icon={<FaTrash color={"red"} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </VStack>
    </Card>
  );
};

export default FileCard;

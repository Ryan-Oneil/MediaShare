import React from "react";
import {
  IconButton,
  Portal,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { displayBytesInReadableForm } from "@/utils/helpers";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaLink, FaTrash } from "react-icons/fa";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";
import useCopyLink from "@/features/fileshare/hooks/useCopyLink";
import { useRouter } from "next/router";
import { FILE_SHARE_URL } from "@/utils/urls";

type props = {
  links: [ISharedLink];
};

const RecentFileUploads = ({ links }: props) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>File</Th>
            <Th>Uploaded</Th>
            <Th>Size</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {links.map((sharedLink) => (
            <TableRow {...sharedLink} key={sharedLink._id} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const TableRow = ({ _id, title, uploaded, size }: ISharedLink) => {
  const { onCopy } = useCopyLink(_id);
  const router = useRouter();
  return (
    <Tr bg={"white"}>
      <Td>{title}</Td>
      <Td>{new Date(uploaded).toLocaleDateString()}</Td>
      <Td>{displayBytesInReadableForm(size)}</Td>
      <Td>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label={"Menu icon"}
            icon={<BsThreeDotsVertical />}
            variant={"ghost"}
          ></MenuButton>
          <Portal>
            <MenuList>
              <MenuItem
                icon={<FaEye />}
                onClick={() => router.push(`${FILE_SHARE_URL}/${_id}`)}
              >
                View
              </MenuItem>
              <MenuItem icon={<FaLink />} onClick={onCopy}>
                Copy Link
              </MenuItem>
              <MenuItem icon={<FaTrash color={"red"} />}>Delete</MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Td>
    </Tr>
  );
};

export default RecentFileUploads;

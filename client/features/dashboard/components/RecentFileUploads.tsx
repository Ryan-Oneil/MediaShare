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
import { SharedLink } from "../types/SharedFile";
import { displayBytesInReadableForm } from "../../../utils/helpers";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaLink, FaTrash } from "react-icons/fa";

type props = {
  links: [SharedLink];
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
            <TableRow {...sharedLink} key={sharedLink.id} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const TableRow = ({ files, uploaded, size }: SharedLink) => {
  return (
    <Tr bg={"white"}>
      <Td>{files[0].name}</Td>
      <Td>{new Date(uploaded).toLocaleDateString()}</Td>
      <Td>{displayBytesInReadableForm(size)}</Td>
      <Td>
        <Menu>
          <MenuButton>
            <IconButton
              aria-label={"Menu icon"}
              icon={<BsThreeDotsVertical />}
              variant={"ghost"}
            />
          </MenuButton>
          <Portal>
            <MenuList>
              <MenuItem icon={<FaEye />}>View</MenuItem>
              <MenuItem icon={<FaLink />}>Copy Link</MenuItem>
              <MenuItem icon={<FaTrash color={"red"} />}>Delete</MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Td>
    </Tr>
  );
};

export default RecentFileUploads;

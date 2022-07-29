import React from "react";
import { Card } from "../../base/components/Card";
import {
  Heading,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { SharedFile } from "../types/SharedFile";
import { displayBytesInReadableForm } from "../../../utils/helpers";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaLink, FaTrash } from "react-icons/fa";

const RecentFileUploads = () => {
  const sampleData: Array<SharedFile> = [
    {
      id: "1",
      name: "file.pdf",
      uploaded: new Date(),
      size: 1000000,
      type: "DOCUMENT",
    },
    {
      id: "2",
      name: "file.docx",
      uploaded: new Date(),
      size: 1000000,
      type: "DOCUMENT",
    },
    {
      id: "3",
      name: "file.txt",
      uploaded: new Date(),
      size: 1000000,
      type: "DOCUMENT",
    },
  ];

  return (
    <Card maxW={"100%"} p={6} rounded={10}>
      <Heading size={"md"} pb={4}>
        Recent file shares
      </Heading>
      <TableContainer>
        <Table
          variant="simple"
          border={"1px solid #E2E8F0"}
          borderRadius={"6px"}
        >
          <Thead bg={"gray.200"}>
            <Tr>
              <Th>File</Th>
              <Th>Uploaded</Th>
              <Th>Size</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sampleData.map((file) => (
              <TableRow {...file} key={file.id} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Card>
  );
};

const TableRow = ({ name, uploaded, size }: SharedFile) => {
  return (
    <Tr>
      <Td>{name}</Td>
      <Td>{uploaded.toLocaleDateString()}</Td>
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
          <MenuList>
            <MenuItem icon={<FaEye />}>View</MenuItem>
            <MenuItem icon={<FaLink />}>Copy Link</MenuItem>
            <MenuItem icon={<FaTrash color={"red"} />}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
};

export default RecentFileUploads;

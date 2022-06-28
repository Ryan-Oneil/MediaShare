import React from "react";
import { Card } from "../../base/components/Card";
import {
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { SharedFile } from "../types/SharedFile";

const RecentUploads = () => {
  const sampleData: Array<SharedFile> = [
    { name: "file.pdf", uploaded: new Date(), size: 1000000, type: "DOCUMENT" },
  ];

  return (
    <Card maxW={"100%"} p={6}>
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
            </Tr>
          </Thead>
          <Tbody>
            {sampleData.map((file) => (
              <TableRow {...file} />
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
      <Td>{size}</Td>
    </Tr>
  );
};

export default RecentUploads;

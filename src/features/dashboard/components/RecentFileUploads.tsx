import React from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Box,
} from "@chakra-ui/react";
import { displayBytesInReadableForm, formatDateToUTC } from "@/utils/helpers";
import { FaEye } from "react-icons/fa";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";
import { useRouter } from "next/router";
import { FILE_SHARE_URL } from "@/utils/urls";
import PlaceholderCTA from "@/features/dashboard/components/PlaceholderCTA";
import LabelIconButton from "@/features/base/components/LabelIconButton";

type props = {
  links: [ISharedLink];
};

const RecentFileUploads = ({ links }: props) => {
  const router = useRouter();
  if (links.length < 1) {
    return (
      <Box w={"20%"} m={"auto"}>
        <PlaceholderCTA
          description={"No shared files"}
          buttonText={"Navigate"}
          onClick={() => router.push("/dashboard/files")}
        />
      </Box>
    );
  }

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
  const router = useRouter();
  return (
    <Tr bg={"white"}>
      <Td>{title ? title : "Untitled Upload"}</Td>
      <Td>{formatDateToUTC(new Date(uploaded))}</Td>
      <Td>{displayBytesInReadableForm(size)}</Td>
      <Td>
        <LabelIconButton
          aria-label={"View"}
          variant={"ghost"}
          icon={<FaEye />}
          onClick={() => router.push(`${FILE_SHARE_URL}/${_id}`)}
        />
      </Td>
    </Tr>
  );
};

export default RecentFileUploads;

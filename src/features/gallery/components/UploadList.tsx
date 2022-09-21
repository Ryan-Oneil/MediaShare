import React, { useMemo } from "react";
import {
  Container,
  Heading,
  IconButton,
  List,
  ListItem,
  Progress,
  Spinner,
  Text,
  useClipboard,
  VStack,
} from "@chakra-ui/react";
import { AiOutlineShareAlt } from "react-icons/ai";
import { UploadItem, UploadStatus } from "@/features/gallery/types/UploadTypes";
import EmptyPlaceHolder from "@/features/base/components/EmptyPlaceHolder";
import Media from "@/features/gallery/components/Media";

const UploadListItem = ({ file, progress, status, src }: UploadItem) => {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  const { onCopy } = useClipboard(src);

  return (
    <ListItem display={"flex"} flex={1} gap={4} alignItems={"center"}>
      <Media
        src={url}
        contentType={file.type}
        h={"100px"}
        w={"160px"}
        rounded={4}
        onLoad={() => URL.revokeObjectURL(url)}
        alt={"Upload preview"}
      />
      <VStack flex={1} gap={1}>
        <Text alignSelf={"start"}>{file.name}</Text>
        <Progress
          size="xs"
          value={status === UploadStatus.FAILED ? 100 : progress}
          colorScheme={status === UploadStatus.FAILED ? "red" : "blue"}
          w={"100%"}
          rounded={"full"}
        />
      </VStack>
      {status === UploadStatus.UPLOADING && <Spinner />}
      {status === UploadStatus.UPLOADED && (
        <IconButton
          aria-label={"Copy share link"}
          icon={<AiOutlineShareAlt size={"28"} />}
          onClick={onCopy}
        />
      )}
    </ListItem>
  );
};

const UploadList = ({ uploadItems }: { uploadItems: UploadItem[] }) => {
  return (
    <Container>
      <Heading size={"md"}>Uploaded files</Heading>
      <List w={"100%"} spacing={4} mt={4} mb={32}>
        {uploadItems.map((uploadItem) => (
          <UploadListItem {...uploadItem} key={uploadItem.file.name} />
        ))}
      </List>
      {uploadItems.length === 0 && (
        <EmptyPlaceHolder description={"No files uploaded yet"} />
      )}
    </Container>
  );
};

export default UploadList;

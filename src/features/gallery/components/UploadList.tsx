import React, { useMemo } from "react";
import {
  Container,
  ContainerProps,
  Heading,
  IconButton,
  List,
  ListItem,
  Progress,
  Spinner,
  Text,
  Tooltip,
  useClipboard,
  VStack,
} from "@chakra-ui/react";
import { AiOutlineShareAlt } from "react-icons/ai";
import { UploadItem, UploadStatus } from "@/features/gallery/types/UploadTypes";
import EmptyPlaceHolder from "@/features/base/components/EmptyPlaceHolder";
import Media from "@/features/gallery/components/Media";
import FileIcon from "@/features/fileshare/components/FileIcon";
import { FaTrash } from "react-icons/fa";
import LabelIconButton from "@/features/base/components/LabelIconButton";

interface UploadListItemProps extends UploadItem {
  onRemove?: (fileName: string) => void;
}

const UploadListItem = ({
  file,
  progress,
  status,
  src,
  onRemove,
}: UploadListItemProps) => {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  const { onCopy } = useClipboard(src);

  return (
    <ListItem display={"flex"} flex={1} gap={4} alignItems={"center"}>
      {(file.type.includes("image") || file.type.includes("video")) && (
        <Media
          src={url}
          contentType={file.type}
          h={"100px"}
          w={"160px"}
          rounded={4}
          onLoad={() => URL.revokeObjectURL(url)}
          alt={"Upload preview"}
        />
      )}
      {!file.type.includes("image") && !file.type.includes("video") && (
        <FileIcon
          _id={"W"}
          contentType={file.type}
          added={new Date()}
          size={file.size}
          name={file.name}
          url={url}
        />
      )}
      <VStack flex={1} gap={1}>
        <Text alignSelf={"start"} wordBreak={"break-all"}>
          {file.name}
        </Text>
        {status !== UploadStatus.PENDING && (
          <Progress
            size="xs"
            value={status === UploadStatus.FAILED ? 100 : progress}
            colorScheme={status === UploadStatus.FAILED ? "red" : "blue"}
            w={"100%"}
            rounded={"full"}
          />
        )}
      </VStack>
      {status === UploadStatus.PENDING && onRemove && (
        <LabelIconButton
          aria-label={"Remove"}
          icon={<FaTrash color={"red"} />}
          onClick={() => onRemove(file.name)}
          variant={"ghost"}
        />
      )}
      {status === UploadStatus.UPLOADING && <Spinner />}
      {status === UploadStatus.UPLOADED && (
        <Tooltip label={"Copy link"}>
          <IconButton
            aria-label={"Copy share link"}
            icon={<AiOutlineShareAlt size={"24"} />}
            onClick={onCopy}
            rounded={"full"}
            size={"sm"}
          />
        </Tooltip>
      )}
    </ListItem>
  );
};

interface UploadListProps extends ContainerProps {
  uploadItems: UploadItem[];
  deleteItemFromList?: (fileName: string) => void;
}

const UploadList = ({
  uploadItems,
  deleteItemFromList,
  ...rest
}: UploadListProps) => {
  //sort by uploading status first
  const sortedUploadItems = useMemo(
    () => [...uploadItems].sort((a, b) => a.status - b.status),
    [uploadItems]
  );

  return (
    <Container {...rest}>
      <Heading size={"md"}>Uploaded files</Heading>
      <List w={"100%"} spacing={4} mt={4} mb={32}>
        {sortedUploadItems.map((uploadItem) => (
          <UploadListItem
            {...uploadItem}
            key={uploadItem.file.name}
            onRemove={deleteItemFromList}
          />
        ))}
      </List>
      {sortedUploadItems.length === 0 && (
        <EmptyPlaceHolder description={"No files uploaded yet"} />
      )}
    </Container>
  );
};

export default UploadList;

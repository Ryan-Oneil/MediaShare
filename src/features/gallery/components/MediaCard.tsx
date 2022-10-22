import React from "react";
import { Box, IconButton, Tooltip, useClipboard } from "@chakra-ui/react";
import { FaLink, FaTrash } from "react-icons/fa";
import { Card } from "@/features/base/components/Card";
import MediaModal from "./MediaModal";
import { IMedia } from "../types/IMedia";

type props = {
  media: IMedia;
  showControls: boolean;
  deleteAction?: (mediaId: string) => void;
};

const MediaCard = ({ media, showControls = true, deleteAction }: props) => {
  const { onCopy } = useClipboard(media.url);

  return (
    <Card
      position={"relative"}
      w="fit-content"
      role={"group"}
      _hover={{ shadow: "xl" }}
      rounded={10}
      height={"fit-content"}
      maxH={"100%"}
    >
      <MediaModal {...media} />
      {showControls && (
        <Box
          as={"section"}
          display={"none"}
          position={"absolute"}
          bottom={0}
          bg={"white"}
          _groupHover={{ display: "block" }}
          roundedTop={4}
          left={"50%"}
          transform={"translateX(-50%)"}
        >
          <Tooltip label={"Copy link"}>
            <IconButton
              variant="ghost"
              aria-label="Copy share link"
              icon={<FaLink />}
              onClick={onCopy}
            />
          </Tooltip>
          <Tooltip label={"Delete media"}>
            <IconButton
              variant="ghost"
              colorScheme="red"
              aria-label="Delete media"
              icon={<FaTrash />}
              onClick={() => (deleteAction ? deleteAction(media._id) : null)}
            />
          </Tooltip>
        </Box>
      )}
    </Card>
  );
};

export default MediaCard;

import React from "react";
import { Box, IconButton, useClipboard } from "@chakra-ui/react";
import { FaLink, FaTrash } from "react-icons/fa";
import { Card } from "@/features/base/components/Card";
import MediaModal from "./MediaModal";
import { TMedia } from "../types/TMedia";

type props = {
  media: TMedia;
  showControls: boolean;
  deleteAction: (mediaId: string) => void;
};

const MediaCard = ({ media, showControls = true, deleteAction }: props) => {
  const { onCopy } = useClipboard(media.url);
  console.log(media);

  return (
    <Card
      position={"relative"}
      w="fit-content"
      role={"group"}
      _hover={{ shadow: "xl" }}
      rounded={10}
      height={"fit-content"}
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
          <IconButton
            variant="ghost"
            aria-label="Copy share link"
            icon={<FaLink />}
            onClick={onCopy}
          />
          <IconButton
            variant="ghost"
            colorScheme="red"
            aria-label="Delete media"
            icon={<FaTrash />}
            onClick={() => deleteAction(media._id)}
          />
        </Box>
      )}
    </Card>
  );
};

export default MediaCard;

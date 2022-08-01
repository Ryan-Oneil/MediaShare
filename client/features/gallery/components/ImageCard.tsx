import React from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { FaLink, FaTrash } from "react-icons/fa";
import { Card } from "../../base/components/Card";
import ImageModal from "./ImageModal";

type props = {
  src: string;
};

const ImageCard = ({ src }: props) => {
  return (
    <Card
      position={"relative"}
      width={"fit-content"}
      role={"group"}
      _hover={{ shadow: "xl" }}
    >
      <ImageModal src={src} maxH={{ base: "100%", md: "250px" }} />
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
        />
        <IconButton
          variant="ghost"
          colorScheme="red"
          aria-label="Delete media"
          icon={<FaTrash />}
        />
      </Box>
    </Card>
  );
};

export default ImageCard;

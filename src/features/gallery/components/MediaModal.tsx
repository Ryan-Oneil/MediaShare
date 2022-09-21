import React from "react";
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import Media from "./Media";
import { TMedia } from "../types/TMedia";

const MediaModal = (props: TMedia) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Media
        src={props.url}
        cursor={"pointer"}
        onClick={onOpen}
        contentType={props.contentType}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton bg={"white"} _hover={{ bg: "white" }} />
          <Media src={props.url} contentType={props.contentType} />
        </ModalContent>
      </Modal>
    </>
  );
};

export default MediaModal;

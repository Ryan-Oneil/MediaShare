import React from "react";
import {
  Image,
  ImageProps,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

const ImageModal = (props: ImageProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Image
        fallbackSrc={"https://via.placeholder.com/800.png"}
        loading={"lazy"}
        cursor={"pointer"}
        {...props}
        onClick={onOpen}
        alt={"User uploaded image"}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Image src={props.src} alt={"User uploaded image"} />
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImageModal;

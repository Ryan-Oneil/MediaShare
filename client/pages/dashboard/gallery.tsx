import React, { useState } from "react";
import BaseAppPage from "../../features/dashboard/components/BaseAppPage";
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import ImageCard from "../../features/gallery/components/ImageCard";
import Uploader from "../../features/gallery/components/Uploader";

const Gallery = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mediaList, setMediaList] = useState([
    { id: 0, src: "https://via.placeholder.com/800.png" },
    { id: 1, src: "https://via.placeholder.com/800.png" },
    { id: 2, src: "https://via.placeholder.com/800.png" },
    { id: 3, src: "https://via.placeholder.com/800.png" },
    { id: 4, src: "https://via.placeholder.com/800.png" },
    { id: 5, src: "https://via.placeholder.com/800.png" },
    { id: 6, src: "https://via.placeholder.com/800.png" },
    { id: 7, src: "https://via.placeholder.com/800.png" },
  ]);

  const handleFileUpload = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onerror = () => console.log("file reading has failed");
      reader.onload = (event) => {
        const result = event.target?.result as string;
        console.log(event.target);

        setMediaList((prevState) => [
          { id: Math.random(), src: result },
          ...prevState,
        ]);
        onClose();
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <BaseAppPage title={"Gallery"}>
      <Flex p={5} bg={"white"} gap={5} boxShadow={"inset 0px -1px 0px #F1F1F1"}>
        <Button variant="outline" rounded={"full"} onClick={onOpen}>
          Upload
        </Button>
        <Input placeholder={"Search name"} width="auto" rounded={"full"} />
        <Spacer />
        <Button width={100} rounded={"full"} variant="outline">
          Sort
        </Button>
      </Flex>
      <SimpleGrid p={5} spacing={10} minChildWidth={"200px"}>
        {mediaList.map((media) => (
          <ImageCard src={media.src} key={media.id} />
        ))}
      </SimpleGrid>
      <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Media</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Uploader h={100} handleUpload={handleFileUpload} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </BaseAppPage>
  );
};

export default Gallery;

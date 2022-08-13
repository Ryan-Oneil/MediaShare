import React, { useState } from "react";
import BaseAppPage from "../../features/dashboard/components/BaseAppPage";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import MediaCard from "../../features/gallery/components/MediaCard";
import Uploader from "../../features/gallery/components/Uploader";
import { GetServerSidePropsContext } from "next";
import { getUserFromRequest } from "../../features/Auth/FirebaseAdmin";
import User from "../../lib/mongoose/model/User";
import { TMedia } from "../../features/gallery/types/TMedia";
import dbConnect from "../../lib/mongoose";

const Gallery = ({ medias }: { medias: Array<TMedia> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mediaList, setMediaList] = useState([]);

  const handleFileUpload = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onerror = () => console.log("file reading has failed");
      reader.onload = (event) => {
        const result = event.target?.result as string;

        setMediaList((prevState) => [
          { id: Math.random(), url: result },
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
      <Box
        padding={4}
        w="100%"
        mx="auto"
        sx={{ columnCount: [1, 2, 3, 4], columnGap: "8px" }}
      >
        {mediaList.map((media: TMedia) => (
          <MediaCard media={media} key={media.id} showControls={true} />
        ))}
        {medias.map((media) => (
          <MediaCard media={media} key={media.id} showControls={true} />
        ))}
      </Box>
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const uid = await getUserFromRequest(context);

  await dbConnect();

  const user = await User.findOne({ externalId: uid }, "medias").lean().exec();

  return {
    props: {
      medias: user.medias,
    },
  };
};

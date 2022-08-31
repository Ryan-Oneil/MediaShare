import React, { useState } from "react";
import BaseAppPage from "@/features/dashboard/components/BaseAppPage";
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
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import MediaCard from "@/features/gallery/components/MediaCard";
import Uploader from "@/features/gallery/components/Uploader";
import { GetServerSidePropsContext } from "next";
import { MediaType, TMedia } from "@/features/gallery/types/TMedia";
import Masonry from "@/features/base/components/Masonry";
import { getUserById } from "@/lib/services/userService";
import {
  getUserIdFromJWT,
  withAuthentication,
} from "@/lib/firebase/wrapperUtils";

const Gallery = ({
  medias,
  storage,
}: {
  medias: Array<TMedia>;
  storage: Storage;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mediaList, setMediaList] = useState<TMedia[]>([]);

  const handleFileUpload = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onerror = () => console.log("file reading has failed");
      reader.onload = (event) => {
        const result = event.target?.result as string;

        setMediaList((prevState) => [
          {
            id: Math.random().toString(),
            url: result,
            size: 0,
            filename: "",
            added: new Date(),
            type: MediaType.IMAGE,
          },
          ...prevState,
        ]);
        onClose();
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <BaseAppPage title={"Gallery"} used={storage.usedTotal} max={storage.max}>
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
      <Masonry columnsCount={5}>
        {mediaList.map((media: TMedia) => (
          <MediaCard media={media} key={media.id} showControls={true} />
        ))}
        {medias.map((media) => (
          <MediaCard media={media} key={media.id} showControls={true} />
        ))}
      </Masonry>
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

export const getServerSideProps = withAuthentication(
  async ({ req }: GetServerSidePropsContext) => {
    const uid = await getUserIdFromJWT(req.cookies.jwt);

    const user = await getUserById(uid, "storage medias");

    return {
      props: {
        medias: user.medias,
        storage: user.storage,
      },
    };
  }
);

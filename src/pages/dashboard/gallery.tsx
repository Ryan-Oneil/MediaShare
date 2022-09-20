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
  ModalOverlay,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import MediaCard from "@/features/gallery/components/MediaCard";
import { GetServerSidePropsContext } from "next";
import { TMedia } from "@/features/gallery/types/TMedia";
import Masonry from "@/features/base/components/Masonry";
import { getUserById } from "@/lib/services/userService";
import {
  getUserIdFromJWT,
  withAuthentication,
} from "@/lib/firebase/wrapperUtils";
import MediaUploader from "@/features/gallery/components/MediaUploader";
import { apiDeleteCall, getApiError } from "@/utils/axios";

const Gallery = ({
  medias,
  storage,
}: {
  medias: Array<TMedia>;
  storage: Storage;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mediaList, setMediaList] = useState<TMedia[]>(medias);

  const deleteMedia = (mediaId: string) => {
    apiDeleteCall(`/api/media/${mediaId}`)
      .then(() => setMediaList((prev) => prev.filter((m) => m._id !== mediaId)))
      .catch((err) => console.log(getApiError(err)));
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
          <MediaCard
            media={media}
            key={media._id}
            showControls={true}
            deleteAction={deleteMedia}
          />
        ))}
      </Masonry>
      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Flex gap={10} p={12}>
              <MediaUploader
                handleUploadFinished={(media: TMedia) =>
                  setMediaList((prev) => [media, ...prev])
                }
              />
            </Flex>
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
        medias: JSON.parse(JSON.stringify(user.medias)),
        storage: user.storage,
      },
    };
  }
);

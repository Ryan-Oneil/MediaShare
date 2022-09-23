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
  useToast,
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
import { Storage } from "@/features/dashboard/types/DashboardUser";

const Gallery = ({
  medias,
  storage,
}: {
  medias: Array<TMedia>;
  storage: Storage;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mediaList, setMediaList] = useState<TMedia[]>(medias);
  const [storageQuota, setStorageQuota] = useState<Storage>(storage);
  const toast = useToast();

  const deleteMedia = (mediaId: string) => {
    const media = mediaList.find((m) => m._id === mediaId);

    if (media) {
      setMediaList((prev) => prev.filter((m) => m._id !== mediaId));

      apiDeleteCall(`/api/media/${mediaId}`).catch((err) => {
        toast({
          title: "Couldn't delete media",
          description: getApiError(err),
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        setMediaList((prev) => [...prev, media]);
        setStorageQuota((prev) => ({
          ...prev,
          used: prev.usedTotal - media.size,
        }));
      });
    }
  };

  return (
    <BaseAppPage
      title={"Gallery"}
      used={storageQuota.usedTotal}
      max={storageQuota.max}
    >
      <Flex p={5} bg={"white"} gap={5} boxShadow={"inset 0px -1px 0px #F1F1F1"}>
        <Button variant="outline" rounded={"full"} onClick={onOpen}>
          Upload
        </Button>
        <Input placeholder={"Search name"} width="auto" rounded={"full"} />
        <Spacer />
        <Button width={100} rounded={"full"} variant="outline">
          Sort by
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
        <ModalContent maxH={"80vh"} overflowX={"hidden"} overflowY={"auto"}>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Flex gap={10} p={12} maxW={"100%"}>
              <MediaUploader
                handleUploadFinished={(media: TMedia) => {
                  setMediaList((prev) => [media, ...prev]);
                  setStorageQuota((prev) => ({
                    ...prev,
                    usedTotal: prev.usedTotal + media.size,
                  }));
                }}
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

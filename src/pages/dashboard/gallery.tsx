import React, { useState } from "react";
import BaseAppPage from "@/features/dashboard/components/BaseAppPage";
import {
  Button,
  Flex,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import MediaCard from "@/features/gallery/components/MediaCard";
import { GetServerSidePropsContext } from "next";
import { IMedia } from "@/features/gallery/types/IMedia";
import Masonry from "@/features/base/components/Masonry";
import { getUserById } from "@/lib/services/userService";
import {
  getUserIdFromJWT,
  withAuthentication,
} from "@/lib/firebase/wrapperUtils";
import { apiDeleteCall } from "@/utils/axios";
import { Storage } from "@/features/dashboard/types/DashboardUser";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";
import MediaUploader from "@/features/gallery/components/MediaUploader";
import useDisplayApiError from "@/features/base/hooks/useDisplayApiError";
import PlaceholderCTA from "@/features/dashboard/components/PlaceholderCTA";

const Gallery = ({
  medias,
  storage,
}: {
  medias: Array<IMedia>;
  storage: Storage;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mediaList, setMediaList] = useState<IMedia[]>(medias);
  const [storageQuota, setStorageQuota] = useState<Storage>(storage);
  const { createToast } = useDisplayApiError();
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 5, "2xl": 6 });

  const deleteMedia = (mediaId: string) => {
    const media = mediaList.find((m) => m._id === mediaId);

    if (media) {
      setMediaList((prev) => prev.filter((m) => m._id !== mediaId));

      apiDeleteCall(`/api/media/${mediaId}`).catch((err) => {
        createToast("Error deleting media", err);
        setMediaList((prev) => [...prev, media]);
        setStorageQuota((prev) => ({
          ...prev,
          usedTotal: prev.usedTotal - media.size,
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
        <Button variant="outline" rounded={"full"} onClick={onOpen} size={"lg"}>
          Upload
        </Button>
      </Flex>
      <Masonry columnsCount={columns || 1}>
        {mediaList.map((media: IMedia) => (
          <MediaCard
            media={media}
            key={media._id}
            showControls={true}
            deleteAction={deleteMedia}
          />
        ))}
      </Masonry>
      {mediaList.length === 0 && (
        <PlaceholderCTA
          description={"No shared media yet"}
          buttonText={"Start uploading now"}
          onClick={onOpen}
        />
      )}
      {isOpen && (
        <MediaUploader
          quotaSpaceRemaining={storageQuota.max - storageQuota.usedTotal}
          handleUploadFinished={(media: UploadedItem) => {
            media._id = media.url.slice(media.url.lastIndexOf("/") + 1);
            setMediaList((prev) => [media, ...prev]);
            setStorageQuota((prev) => ({
              ...prev,
              usedTotal: prev.usedTotal + media.size,
            }));
          }}
          onClose={onClose}
        />
      )}
    </BaseAppPage>
  );
};

export default Gallery;

export const getServerSideProps = withAuthentication(
  async ({ req }: GetServerSidePropsContext) => {
    const uid = await getUserIdFromJWT(req.cookies.jwt);
    const user = JSON.parse(
      JSON.stringify(await getUserById(uid, "storage medias"))
    );

    return {
      props: {
        medias: user.medias,
        storage: user.storage,
      },
    };
  }
);

import React, { useState } from "react";
import DropzoneUploader from "@/features/gallery/components/DropzoneUploader";
import UploadList from "@/features/gallery/components/UploadList";
import { apiPostCall, apiPutCall, getApiError } from "@/utils/axios";
import { TMedia } from "@/features/gallery/types/TMedia";
import { useToast } from "@chakra-ui/react";
import { UploadItem, UploadStatus } from "@/features/gallery/types/UploadTypes";

type props = {
  handleUploadFinished: (media: TMedia) => void;
};

const getUploadUrls = async (acceptedFiles: UploadItem[]) => {
  const mediaNames = acceptedFiles.map((media) => {
    return { name: media.file.name, size: media.file.size };
  });
  const urls = await apiPostCall("/api/media", mediaNames);

  return urls.data;
};

const MediaUploader = ({ handleUploadFinished }: props) => {
  const [uploadingMedia, setUploadingMedia] = useState<UploadItem[]>([]);
  const toast = useToast();

  const updateUpload = (uploadItem: UploadItem) => {
    setUploadingMedia((prev) => {
      const newMedia = prev.filter((m) => m.file.name !== uploadItem.file.name);
      newMedia.push(uploadItem);

      return newMedia;
    });
  };

  const uploadMedia = (media: UploadItem, url: string) => {
    const uploadingFile = media.file;

    apiPutCall(url, uploadingFile, {
      headers: { "Content-Type": uploadingFile.type },
      onUploadProgress: (progressEvent) => {
        const total = parseFloat(progressEvent.total);
        const current = progressEvent.loaded;

        const progress = Math.floor((current / total) * 100);
        updateUpload({ ...media, progress, status: UploadStatus.UPLOADING });
      },
    })
      .then((response) => {
        const uploadedUrl = response.data as string;

        updateUpload({
          ...media,
          src: uploadedUrl,
          status: UploadStatus.UPLOADED,
          progress: 100,
        });
        handleUploadFinished({
          url: uploadedUrl,
          contentType: uploadingFile.type,
          filename: uploadingFile.name,
          _id: uploadedUrl.slice(uploadedUrl.lastIndexOf("/") + 1),
          added: new Date(),
          size: uploadingFile.size,
        });
      })
      .catch(() => {
        updateUpload({ ...media, status: UploadStatus.FAILED });
      });
  };

  const handleFileDrop = async (acceptedFiles: File[]) => {
    const mediaToUpload = acceptedFiles.map((file) => {
      return {
        src: "",
        progress: 0,
        file,
        status: UploadStatus.PENDDING,
      };
    });
    setUploadingMedia((prevState) => [...prevState, ...mediaToUpload]);

    try {
      const urls = await getUploadUrls(mediaToUpload);

      urls.forEach((url: string, index: number) => {
        uploadMedia(mediaToUpload[index], url);
      });
    } catch (error: any) {
      toast({
        title: "Error uploading media",
        description: getApiError(error),
        status: "error",
        isClosable: true,
      });
      setUploadingMedia((prevState) => {
        const nonFailedMedia = prevState.filter(
          (m) => m.status !== UploadStatus.PENDDING
        );

        return [
          ...nonFailedMedia,
          ...mediaToUpload.map((m) => ({ ...m, status: UploadStatus.FAILED })),
        ];
      });
    }
  };

  return (
    <>
      <DropzoneUploader
        handleFileSelected={handleFileDrop}
        accept={{ "image/*": [".png", ".gif", ".jpeg", ".jpg"], "video/*": [] }}
      />
      <UploadList uploadItems={uploadingMedia} />
    </>
  );
};

export default MediaUploader;

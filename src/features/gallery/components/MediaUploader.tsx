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
  const mediaNames = acceptedFiles.map((media) => media.file.name);
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
        updateUpload({ ...media, progress });
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
          type: uploadingFile.type,
          filename: uploadingFile.name,
          _id: uploadedUrl.slice(uploadedUrl.lastIndexOf("/") + 1),
          added: new Date(),
          size: uploadingFile.size,
        });
      })
      .catch((error) => {
        toast({
          title: "Error uploading file",
          description: getApiError(error),
          status: "error",
          isClosable: true,
        });
        updateUpload({ ...media, status: UploadStatus.FAILED });
      });
  };

  const handleFileDrop = async (acceptedFiles: File[]) => {
    const mediaToUpload = acceptedFiles.map((file) => {
      return {
        src: "",
        progress: 0,
        file,
        status: UploadStatus.UPLOADING,
      };
    });
    setUploadingMedia((prevState) => [...prevState, ...mediaToUpload]);

    const urls = await getUploadUrls(mediaToUpload);

    urls.forEach((url: string, index: number) => {
      uploadMedia(mediaToUpload[index], url);
    });
  };

  return (
    <>
      <DropzoneUploader handleFileSelected={handleFileDrop} />
      <UploadList uploadItems={uploadingMedia} />
    </>
  );
};

export default MediaUploader;

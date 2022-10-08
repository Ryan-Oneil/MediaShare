import React, { useState } from "react";
import DropzoneFileSelector from "@/features/gallery/components/DropzoneFileSelector";
import UploadList from "@/features/gallery/components/UploadList";
import { UploadItem, UploadStatus } from "@/features/gallery/types/UploadTypes";
import { apiPostCall, apiPutCall, getApiError } from "@/utils/axios";
import { IMedia } from "@/features/gallery/types/IMedia";
import { useToast } from "@chakra-ui/react";

type props = {
  handleUploadFinished: (media: IMedia) => void;
  quotaSpaceRemaining: number;
};

const MediaUploader = ({
  handleUploadFinished,
  quotaSpaceRemaining,
}: props) => {
  const toast = useToast();
  const [uploadingMedia, setUploadingMedia] = useState<UploadItem[]>([]);

  const updateUpload = (uploadItem: UploadItem) => {
    setUploadingMedia((prev) => {
      const newMedia = prev.filter((m) => m.file.name !== uploadItem.file.name);
      newMedia.push(uploadItem);

      return newMedia;
    });
  };

  const getUploadUrls = async (acceptedFiles: UploadItem[]) => {
    const fileDetails = acceptedFiles.map(({ file }) => {
      return { name: file.name, size: file.size };
    });
    const urls = await apiPostCall("/api/media", fileDetails);

    return urls.data;
  };

  const uploadMedia = (uploadItem: UploadItem, url: string) => {
    const uploadingFile = uploadItem.file;

    apiPutCall(url, uploadingFile, {
      headers: { "Content-Type": uploadingFile.type },
      onUploadProgress: (progressEvent) => {
        const total = parseFloat(progressEvent.total);
        const current = progressEvent.loaded;

        const progress = Math.floor((current / total) * 100);
        updateUpload({
          ...uploadItem,
          progress,
          status: UploadStatus.UPLOADING,
        });
      },
    })
      .then((response) => {
        const uploadedUrl = response.data as string;

        const { file, src } = uploadItem;

        updateUpload({
          ...uploadItem,
          src: uploadedUrl,
          status: UploadStatus.UPLOADED,
          progress: 100,
        });
        handleUploadFinished({
          url: uploadedUrl,
          contentType: file.type,
          filename: file.name,
          _id: src.slice(src.lastIndexOf("/") + 1),
          added: new Date(),
          size: file.size,
        });
      })
      .catch(() => {
        updateUpload({ ...uploadItem, status: UploadStatus.FAILED });
      });
  };

  const handleFilesChosen = async (files: UploadItem[]) => {
    setUploadingMedia((prevState) => [...prevState, ...files]);

    try {
      const urls = await getUploadUrls(files);

      urls.forEach((url: string, index: number) => {
        uploadMedia(files[index], url);
      });
    } catch (error: any) {
      toast({
        title: "Error uploading File",
        description: getApiError(error),
        status: "error",
        isClosable: true,
        duration: 2000,
      });
    }
  };

  return (
    <>
      <DropzoneFileSelector
        maxSize={quotaSpaceRemaining}
        accept={{ "image/*": [".png", ".gif", ".jpeg", ".jpg"], "video/*": [] }}
        validator={(file) => {
          const fileExists = uploadingMedia.some(
            (m) => m.file.name === file.name
          );
          if (fileExists) {
            return {
              code: "file-exists",
              message: "You have already uploaded this file.",
            };
          }
          return null;
        }}
        handleFilesChosen={handleFilesChosen}
      />
      <UploadList uploadItems={uploadingMedia} />
    </>
  );
};

export default MediaUploader;

import { useState } from "react";
import {
  UploadedItem,
  UploadItem,
  UploadStatus,
} from "@/features/gallery/types/UploadTypes";
import { useToast } from "@chakra-ui/react";
import { apiPostCall, apiPutCall, getApiError } from "@/utils/axios";

const useFileUpload = (
  presignedUrlEndpoint: string,
  handleUploadFinished: (uploadedFile: UploadedItem) => void
) => {
  const [uploadItemList, setUploadItemList] = useState<UploadItem[]>([]);
  const toast = useToast();

  const updateUpload = (uploadItem: UploadItem) => {
    setUploadItemList((prev) => {
      const newItem = prev.filter((m) => m.file.name !== uploadItem.file.name);
      newItem.push(uploadItem);

      return newItem;
    });
  };

  const getUploadUrls = async (acceptedFiles: UploadItem[]) => {
    const fileDetails = acceptedFiles.map(({ file }) => {
      return { name: file.name, size: file.size };
    });
    const urls = await apiPostCall(presignedUrlEndpoint, fileDetails);

    return urls.data;
  };

  const uploadFile = (uploadItem: UploadItem, url: string) => {
    const uploadingFile = uploadItem.file;

    return apiPutCall(url, uploadingFile, {
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
        return {
          url: uploadedUrl,
          contentType: file.type,
          filename: file.name,
          _id: src.slice(src.lastIndexOf("/") + 1),
          added: new Date(),
          size: file.size,
        };
      })
      .catch(() => {
        updateUpload({ ...uploadItem, status: UploadStatus.FAILED });
      });
  };

  const addFilesToBeUploaded = (acceptedFiles: UploadItem[]) => {
    setUploadItemList((prevState) => [...prevState, ...acceptedFiles]);
  };

  const uploadSelectedFiles = async (filesToBeUploaded: UploadItem[]) => {
    try {
      const urls = await getUploadUrls(filesToBeUploaded);

      for (const url of urls) {
        const index: number = urls.indexOf(url);
        const uploadedItem = await uploadFile(filesToBeUploaded[index], url);

        if (uploadedItem && handleUploadFinished) {
          handleUploadFinished(uploadedItem);
        }
      }
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

  const uploadWaitingFiles = (
    uploadUrls: Array<{ url: string; fileName: string }>
  ) => {
    const waitingFiles = uploadItemList.filter(
      (m) => m.status === UploadStatus.PENDING
    );

    return Promise.all(
      uploadUrls.map((upload, index) => {
        const waitingFile = waitingFiles.find(
          (m) => m.file.name === upload.fileName
        ) as UploadItem;

        return uploadFile(waitingFile, upload.url);
      })
    );
  };

  return {
    uploadSelectedFiles,
    uploadItemList,
    addFilesToBeUploaded,
    uploadWaitingFiles,
  };
};

export default useFileUpload;

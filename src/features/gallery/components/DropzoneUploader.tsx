import React from "react";
import { Button, Container, Text, useToast } from "@chakra-ui/react";
import Dropzone, { DropzoneProps } from "react-dropzone";
import Image from "next/image";
import { UploadItem, UploadStatus } from "@/features/gallery/types/UploadTypes";
import { apiPostCall, apiPutCall, getApiError } from "@/utils/axios";

interface DropZoneProps extends DropzoneProps {
  handleFilesChosen: (files: UploadItem[]) => void;
  handleUploadUpdate: (file: UploadItem) => void;
  handleUploadFinished: (file: UploadItem) => void;
}

const getUploadUrls = async (acceptedFiles: UploadItem[]) => {
  const fileDetails = acceptedFiles.map(({ file }) => {
    return { name: file.name, size: file.size };
  });
  const urls = await apiPostCall("/api/media", fileDetails);

  return urls.data;
};

const DropzoneUploader = (props: DropZoneProps) => {
  const {
    handleFilesChosen,
    handleUploadUpdate,
    handleUploadFinished,
    ...rest
  } = props;
  const toast = useToast();

  const uploadMedia = (uploadItem: UploadItem, url: string) => {
    const uploadingFile = uploadItem.file;

    apiPutCall(url, uploadingFile, {
      headers: { "Content-Type": uploadingFile.type },
      onUploadProgress: (progressEvent) => {
        const total = parseFloat(progressEvent.total);
        const current = progressEvent.loaded;

        const progress = Math.floor((current / total) * 100);
        handleUploadUpdate({
          ...uploadItem,
          progress,
          status: UploadStatus.UPLOADING,
        });
      },
    })
      .then((response) => {
        const uploadedUrl = response.data as string;

        handleUploadFinished({
          ...uploadItem,
          src: uploadedUrl,
        });
      })
      .catch(() => {
        handleUploadUpdate({ ...uploadItem, status: UploadStatus.FAILED });
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
    handleFilesChosen(mediaToUpload);

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
    }
  };

  return (
    <Dropzone
      onDropAccepted={handleFileDrop}
      onDropRejected={(rejectedFiles) => {
        rejectedFiles.forEach((rejectedFile) => {
          const error = rejectedFile.errors[0].message.includes(
            "File is larger"
          )
            ? "This file would exceed your storage"
            : rejectedFile.errors[0].message;
          toast({
            title: `Error uploading ${rejectedFile.file.name}`,
            description: error,
            status: "error",
            isClosable: true,
          });
        });
      }}
      {...rest}
    >
      {({ getRootProps, getInputProps }) => (
        <Container
          centerContent
          as={"section"}
          borderStyle={"dashed"}
          borderWidth={"2px"}
          borderRadius={"1rem"}
          p={8}
          borderColor={"brand.100"}
          _hover={{ borderColor: "brand.200", bg: "#FAFAFA" }}
          cursor={"pointer"}
          {...getRootProps()}
          flexDirection={"column"}
          gap={1}
          justifyContent={"center"}
        >
          <input {...getInputProps()} />
          <Image
            src={"/media.png"}
            width={280}
            height={200}
            draggable={false}
            alt={"Upload Media"}
          />
          <Text mt={5}>Drag and drop your media</Text>
          <Text>Or</Text>
          <Button rounded={"4"} w={"45%"}>
            Browse
          </Button>
        </Container>
      )}
    </Dropzone>
  );
};

export default DropzoneUploader;

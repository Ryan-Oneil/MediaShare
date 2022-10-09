import React from "react";
import { Button, Container, Text, useToast } from "@chakra-ui/react";
import Dropzone, { DropzoneProps } from "react-dropzone";
import Image from "next/image";
import { UploadItem, UploadStatus } from "@/features/gallery/types/UploadTypes";

interface DropZoneProps extends DropzoneProps {
  handleFilesChosen: (files: UploadItem[]) => void;
}

const DropzoneFileSelector = (props: DropZoneProps) => {
  const { handleFilesChosen, ...rest } = props;
  const toast = useToast();

  const handleFileDrop = async (acceptedFiles: File[]) => {
    const mediaToUpload = acceptedFiles.map((file) => {
      return {
        src: "",
        progress: 0,
        file,
        status: UploadStatus.PENDING,
      };
    });
    handleFilesChosen(mediaToUpload);
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
          <Text mt={5}>Drag and drop your Files</Text>
          <Text>Or</Text>
          <Button rounded={"4"} w={"45%"}>
            Browse
          </Button>
        </Container>
      )}
    </Dropzone>
  );
};

export default DropzoneFileSelector;

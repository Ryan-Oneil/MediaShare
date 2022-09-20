import React from "react";
import { Button, Container, ContainerProps, Text } from "@chakra-ui/react";
import Dropzone, { DropzoneOptions } from "react-dropzone";
import Image from "next/image";

interface DropZoneProps extends ContainerProps {
  handleFileSelected: DropzoneOptions["onDrop"];
}

const DropzoneUploader = (props: DropZoneProps) => {
  const { handleFileSelected, ...rest } = props;

  return (
    <Dropzone onDrop={handleFileSelected}>
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
          {...rest}
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

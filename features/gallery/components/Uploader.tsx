import React from "react";
import { Container, ContainerProps, Text } from "@chakra-ui/react";
import Dropzone, { DropzoneOptions } from "react-dropzone";

interface UploaderProps extends ContainerProps {
  handleUpload: DropzoneOptions["onDrop"];
}

const Uploader = (props: UploaderProps) => {
  return (
    <Dropzone onDrop={props.handleUpload}>
      {({ getRootProps, getInputProps }) => (
        <Container
          centerContent
          as={"section"}
          borderStyle={"dashed"}
          borderWidth={"2px"}
          borderRadius={"1rem"}
          p={5}
          borderColor={"brand.100"}
          _hover={{ borderColor: "brand.200", bg: "#FAFAFA" }}
          cursor={"pointer"}
          {...props}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Text m={"auto"}>Drag and drop your media or click to upload</Text>
        </Container>
      )}
    </Dropzone>
  );
};

export default Uploader;

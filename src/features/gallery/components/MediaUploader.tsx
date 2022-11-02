import React from "react";
import DropzoneFileSelector from "@/features/gallery/components/DropzoneFileSelector";
import UploadList from "@/features/gallery/components/UploadList";
import { IMedia } from "@/features/gallery/types/IMedia";
import useFileUpload from "@/features/gallery/hooks/useFileUpload";
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

type props = {
  handleUploadFinished: (media: IMedia) => void;
  quotaSpaceRemaining: number;
  onClose: () => void;
};

const MediaUploader = ({
  handleUploadFinished,
  quotaSpaceRemaining,
  onClose,
}: props) => {
  const { uploadSelectedFiles, uploadItemList } = useFileUpload(
    "/api/media",
    handleUploadFinished
  );

  return (
    <Modal isOpen={true} onClose={onClose} size={"6xl"}>
      <ModalOverlay />
      <ModalContent maxH={"80vh"} overflowX={"hidden"} overflowY={"auto"}>
        <ModalCloseButton />
        <ModalBody p={0}>
          <Flex gap={10} p={12} maxW={"100%"} maxH={"60vh"}>
            <DropzoneFileSelector
              maxSize={quotaSpaceRemaining}
              accept={{
                "image/*": [".png", ".gif", ".jpeg", ".jpg"],
                "video/*": [],
              }}
              validator={(file) => {
                const fileExists = uploadItemList.some(
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
              handleFilesChosen={uploadSelectedFiles}
            />
            <UploadList uploadItems={uploadItemList} overflow={"auto"} />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MediaUploader;

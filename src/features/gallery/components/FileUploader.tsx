import React from "react";
import DropzoneFileSelector from "@/features/gallery/components/DropzoneFileSelector";
import UploadList from "@/features/gallery/components/UploadList";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import useFileUpload from "@/features/gallery/hooks/useFileUpload";
import { apiPostCall, getApiError } from "@/utils/axios";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";

type props = {
  handleUploadFinished: (sharedLink: ISharedLink) => void;
  quotaSpaceRemaining: number;
  onClose: () => void;
};

const FileUploader = ({
  handleUploadFinished,
  quotaSpaceRemaining,
  onClose,
}: props) => {
  const { uploadItemList, addFilesToBeUploaded, uploadWaitingFiles } =
    useFileUpload("/api/share");
  const [shareTitle, setShareTitle] = React.useState<string>("");
  const [shareId, setShareId] = React.useState<string>("");
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const toast = useToast();

  const shareFiles = async () => {
    setIsUploading(true);
    const { data } = await apiPostCall("/api/share", {
      title: shareTitle,
      files: uploadItemList.map(({ file }) => {
        return { name: file.name, size: file.size };
      }),
    });
    setShareId(data.linkId);

    uploadWaitingFiles(data.uploadUrls)
      .then((uploadedFiles) => {
        const link: ISharedLink = {
          title: shareTitle,
          size: uploadedFiles.reduce((acc, item) => acc + item.size, 0),
          expires: new Date(),
          files: uploadedFiles,
          _id: shareId,
          uploaded: new Date(),
        };
        handleUploadFinished(link);
        onClose();
      })
      .catch((error) => {
        toast({
          title: "Error uploading File",
          description: getApiError(error),
          status: "error",
          isClosable: true,
          duration: 2000,
        });
        setIsUploading(false);
      });
  };

  return (
    <Modal isOpen={true} onClose={onClose} size={"6xl"}>
      <ModalOverlay />
      <ModalContent maxH={"80vh"} overflowX={"hidden"} overflowY={"auto"}>
        <ModalCloseButton />
        <ModalBody p={0}>
          <Flex gap={10} p={12} pb={0} maxW={"100%"}>
            <DropzoneFileSelector
              maxSize={quotaSpaceRemaining}
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
              handleFilesChosen={addFilesToBeUploaded}
              disabled={isUploading}
            />
            <Box w={"100%"}>
              <Input
                placeholder="Title"
                mb={4}
                value={shareTitle}
                onChange={(event) => setShareTitle(event.target.value)}
                maxLength={60}
                disabled={isUploading}
              />
              <UploadList uploadItems={uploadItemList} />
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={shareFiles}
            disabled={isUploading}
          >
            Share
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FileUploader;

import React from "react";
import DropzoneFileSelector from "@/features/gallery/components/DropzoneFileSelector";
import UploadList from "@/features/gallery/components/UploadList";
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
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import useFileUpload from "@/features/gallery/hooks/useFileUpload";
import { apiPostCall } from "@/utils/axios";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";
import useDisplayApiError from "@/features/base/hooks/useDisplayApiError";

type props = {
  handleUploadFinished: (sharedLink: ISharedLink) => void;
  quotaSpaceRemaining: number;
  onClose: () => void;
  linkId?: string;
  title?: string;
};

const FileUploader = ({
  handleUploadFinished,
  quotaSpaceRemaining,
  onClose,
  linkId,
  title = "",
}: props) => {
  const { uploadItemList, addFilesToBeUploaded, uploadWaitingFiles } =
    useFileUpload("/api/share");
  const [shareTitle, setShareTitle] = React.useState<string>(title);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const { createToast } = useDisplayApiError();

  const shareFiles = async () => {
    setIsUploading(true);
    const url = linkId ? `/api/share/${linkId}` : "/api/share";

    try {
      const { data } = await apiPostCall(url, {
        title: shareTitle,
        files: uploadItemList.map(({ file }) => {
          return { name: file.name, size: file.size };
        }),
      });

      uploadWaitingFiles(data.uploadUrls)
        .then((uploadedFiles) => {
          const link: ISharedLink = {
            title: shareTitle,
            size: uploadedFiles.reduce((acc, item) => acc + item.size, 0),
            expires: new Date(),
            files: uploadedFiles,
            _id: data.linkId,
            uploaded: new Date(),
          };
          handleUploadFinished(link);
          onClose();
        })
        .catch((error) => {
          createToast("Error uploading files", error);
          setIsUploading(false);
        });
    } catch (error: any) {
      createToast("Error sharing files", error);
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size={"6xl"}>
      <ModalOverlay />
      <ModalContent maxH={"80vh"} overflowX={"hidden"} overflowY={"auto"}>
        {linkId && <ModalHeader>Editing shared link</ModalHeader>}
        <ModalCloseButton />
        <ModalBody p={0}>
          <Flex gap={10} p={12} pb={0} maxW={"100%"} maxH={"60vh"}>
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
            <Box w={"100%"} overflow={"auto"}>
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

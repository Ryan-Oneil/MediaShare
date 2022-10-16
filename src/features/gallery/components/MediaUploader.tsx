import React from "react";
import DropzoneFileSelector from "@/features/gallery/components/DropzoneFileSelector";
import UploadList from "@/features/gallery/components/UploadList";
import { IMedia } from "@/features/gallery/types/IMedia";
import useFileUpload from "@/features/gallery/hooks/useFileUpload";

type props = {
  handleUploadFinished: (media: IMedia) => void;
  quotaSpaceRemaining: number;
};

const MediaUploader = ({
  handleUploadFinished,
  quotaSpaceRemaining,
}: props) => {
  const { uploadSelectedFiles, uploadItemList } = useFileUpload(
    "/api/media",
    handleUploadFinished
  );

  return (
    <>
      <DropzoneFileSelector
        maxSize={quotaSpaceRemaining}
        accept={{ "image/*": [".png", ".gif", ".jpeg", ".jpg"], "video/*": [] }}
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
      <UploadList uploadItems={uploadItemList} />
    </>
  );
};

export default MediaUploader;

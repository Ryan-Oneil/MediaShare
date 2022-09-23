import React, { useState } from "react";
import DropzoneUploader from "@/features/gallery/components/DropzoneUploader";
import UploadList from "@/features/gallery/components/UploadList";
import { TMedia } from "@/features/gallery/types/TMedia";
import { UploadItem, UploadStatus } from "@/features/gallery/types/UploadTypes";

type props = {
  handleUploadFinished: (media: TMedia) => void;
  quotaSpaceRemaining: number;
};

const MediaUploader = ({
  handleUploadFinished,
  quotaSpaceRemaining,
}: props) => {
  const [uploadingMedia, setUploadingMedia] = useState<UploadItem[]>([]);

  const updateUpload = (uploadItem: UploadItem) => {
    setUploadingMedia((prev) => {
      const newMedia = prev.filter((m) => m.file.name !== uploadItem.file.name);
      newMedia.push(uploadItem);

      return newMedia;
    });
  };

  return (
    <>
      <DropzoneUploader
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
        handleFilesChosen={(acceptedFiles) =>
          setUploadingMedia((prevState) => [...prevState, ...acceptedFiles])
        }
        handleUploadUpdate={(media) => updateUpload(media)}
        handleUploadFinished={(media) => {
          const { file, src } = media;

          updateUpload({
            ...media,
            src: src,
            status: UploadStatus.UPLOADED,
            progress: 100,
          });
          handleUploadFinished({
            url: media.src,
            contentType: file.type,
            filename: file.name,
            _id: src.slice(src.lastIndexOf("/") + 1),
            added: new Date(),
            size: file.size,
          });
        }}
      />
      <UploadList uploadItems={uploadingMedia} />
    </>
  );
};

export default MediaUploader;

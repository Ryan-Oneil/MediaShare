import React from "react";
import { List, IconButton, Link } from "@chakra-ui/react";
import { ImDownload3 } from "react-icons/im";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";
import FileDetail from "@/features/fileshare/components/FileDetail";
import axios from "axios";

const FileList = ({ files }: ISharedLink) => {
  const ref = React.useRef<HTMLAnchorElement>(null);
  return (
    <>
      <List spacing={5}>
        {files.map((file: UploadedItem) => (
          <FileDetail key={file.name} {...file}>
            <IconButton
              aria-label={"Download"}
              icon={<ImDownload3 />}
              onClick={() => {
                axios
                  .get(file.url, {
                    responseType: "blob",
                  })
                  .then(({ data }) => {
                    const url = window.URL.createObjectURL(new Blob([data]));
                    const link = ref.current;
                    if (link) {
                      link.href = url;
                      link.download = file.name;
                      link.click();
                    }
                  });
              }}
            />
          </FileDetail>
        ))}
      </List>
      <Link display={"none"} ref={ref} />
    </>
  );
};

export default FileList;

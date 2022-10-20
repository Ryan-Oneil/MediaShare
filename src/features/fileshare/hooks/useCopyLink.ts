import { useEffect, useState } from "react";
import { useClipboard } from "@chakra-ui/react";
import { FILE_SHARE_URL } from "@/utils/urls";

const useCopyLink = (linkId: string) => {
  const [url, setUrl] = useState<string>("");
  const { onCopy } = useClipboard(url);

  useEffect(() => {
    if (window) {
      setUrl(`${window.location.origin}${FILE_SHARE_URL}/${linkId}`);
    }
  }, []);

  return { onCopy };
};
export default useCopyLink;

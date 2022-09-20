import React, { MouseEventHandler } from "react";
import { Image } from "@chakra-ui/react";

type MediaProps = {
  src: string;
  cursor?: string;
  onClick?: MouseEventHandler;
};

const Media = ({ src, cursor, onClick }: MediaProps) => {
  const [url, setUrl] = React.useState<string>(src);

  return (
    <Image
      src={url}
      loading={"lazy"}
      objectFit="cover"
      alt={"User uploaded image"}
      cursor={cursor}
      onClick={onClick}
      onError={() => setUrl("/missing.png")}
    />
  );
};
export default Media;

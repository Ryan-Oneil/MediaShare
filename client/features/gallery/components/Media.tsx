import React, { MouseEventHandler } from "react";
import { Image } from "@chakra-ui/react";

type MediaProps = {
  src: string;
  cursor?: string;
  onClick?: MouseEventHandler;
};

const Media = ({ src, cursor, onClick }: MediaProps) => {
  return (
    <Image
      src={src}
      fallbackSrc={"https://via.placeholder.com/800.png"}
      loading={"lazy"}
      objectFit="cover"
      alt={"User uploaded image"}
      cursor={cursor}
      onClick={onClick}
    />
  );
};
export default Media;

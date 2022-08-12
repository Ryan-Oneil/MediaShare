import React, { MouseEventHandler } from "react";
import { Image } from "@chakra-ui/react";

type MediaProps = {
  src: string;
  cursor?: string;
  onClick?: MouseEventHandler;
  limitHeight?: boolean;
};

const Media = ({ src, cursor, onClick, limitHeight = true }: MediaProps) => {
  const maxHeight = limitHeight
    ? { base: "100%", md: "250px" }
    : { base: "100%" };

  return (
    <Image
      src={src}
      fallbackSrc={"https://via.placeholder.com/800.png"}
      loading={"lazy"}
      objectFit="cover"
      maxH={maxHeight}
      alt={"User uploaded image"}
      cursor={cursor}
      onClick={onClick}
    />
  );
};
export default Media;

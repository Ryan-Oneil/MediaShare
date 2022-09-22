import React, { MouseEventHandler } from "react";
import { Box, Image, ImageProps } from "@chakra-ui/react";

interface MediaProps extends ImageProps {
  src: string;
  cursor?: string;
  onClick?: MouseEventHandler;
  contentType: string;
  onLoad?: () => void;
  showControls?: boolean;
}

const Media = ({
  src,
  cursor,
  onClick,
  contentType,
  onLoad,
  showControls = true,
  ...rest
}: MediaProps) => {
  const [url, setUrl] = React.useState<string>(src);

  if (contentType.includes("image")) {
    return (
      <Image
        src={url}
        loading={"lazy"}
        objectFit="cover"
        alt={"User uploaded image"}
        cursor={cursor}
        onClick={onClick}
        onError={() => setUrl("/missing.png")}
        onLoad={onLoad}
        {...rest}
      />
    );
  } else {
    return (
      <Box {...rest}>
        <video
          src={url}
          controls={showControls}
          style={{ maxWidth: "100%", maxHeight: "100%", width: "100%" }}
          muted
          onLoad={onLoad}
          onClick={onClick}
        />
      </Box>
    );
  }
};
export default Media;

import React, { useEffect } from "react";
import { Box, Stack } from "@chakra-ui/react";
import MediaModal from "@/features/gallery/components/MediaModal";
import EmptyPlaceHolder from "@/features/base/components/EmptyPlaceHolder";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";

type RecentMediaUploadsProps = {
  medias: Array<UploadedItem>;
};

const RecentMediaUploads = ({ medias }: RecentMediaUploadsProps) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [amountOfItems, setAmountOfItems] = React.useState(2);

  // @ts-ignore
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const stackWidth = entries[0].contentRect.width || 200;
      const totalItems = Math.max(Math.ceil(stackWidth / 200), 1);

      setAmountOfItems(totalItems);
    });
    // @ts-ignore
    observer.observe(elementRef.current);
    return () => elementRef.current && observer.unobserve(elementRef.current);
  }, []);

  return (
    <Stack
      gap={4}
      direction={"row"}
      maxH={200}
      overflow={"hidden"}
      ref={elementRef}
    >
      {medias
        .filter((media) => media.contentType.includes("image"))
        .slice(0, amountOfItems)
        .map((media) => (
          <Box
            width={"auto"}
            maxW={200}
            rounded={10}
            overflow={"hidden"}
            key={media._id}
          >
            <MediaModal {...media} />
          </Box>
        ))}
      {medias.length < 1 && (
        <EmptyPlaceHolder description={"No recent Uploads"} />
      )}
    </Stack>
  );
};
export default RecentMediaUploads;

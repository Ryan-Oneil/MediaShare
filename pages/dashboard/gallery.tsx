import React from "react";
import BaseAppPage from "../../features/dashboard/components/BaseAppPage";
import { Button, Flex, Input, SimpleGrid, Spacer } from "@chakra-ui/react";
import ImageCard from "../../features/gallery/components/ImageCard";

const Gallery = () => {
  const mediaList = [
    { id: 0, src: "https://via.placeholder.com/800.png" },
    { id: 1, src: "https://via.placeholder.com/800.png" },
    { id: 2, src: "https://via.placeholder.com/800.png" },
    { id: 3, src: "https://via.placeholder.com/800.png" },
    { id: 4, src: "https://via.placeholder.com/800.png" },
    { id: 5, src: "https://via.placeholder.com/800.png" },
    { id: 6, src: "https://via.placeholder.com/800.png" },
    { id: 7, src: "https://via.placeholder.com/800.png" },
  ];

  return (
    <BaseAppPage title={"Gallery"}>
      <Flex p={5} bg={"white"} gap={5} boxShadow={"inset 0px -1px 0px #F1F1F1"}>
        <Button variant="outline" rounded={"full"}>
          Upload
        </Button>
        <Input placeholder={"Search name"} width="auto" rounded={"full"} />
        <Spacer />
        <Button width={100} rounded={"full"} variant="outline">
          Sort
        </Button>
      </Flex>
      <SimpleGrid p={5} spacing={10} minChildWidth={"200px"}>
        {mediaList.map((media) => (
          <ImageCard src={media.src} key={media.id} />
        ))}
      </SimpleGrid>
    </BaseAppPage>
  );
};

export default Gallery;

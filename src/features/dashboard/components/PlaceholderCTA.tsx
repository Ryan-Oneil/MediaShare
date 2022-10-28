import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import emptyPlaceholder from "../../../../public/share.svg";

type Props = {
  imageSrc?: string;
  description: string;
  buttonText: string;
  onClick: () => void;
};

const PlaceholderCTA = ({
  imageSrc,
  description,
  buttonText,
  onClick,
}: Props) => {
  return (
    <Flex
      h={"50%"}
      w={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
      gap={4}
    >
      <Image
        src={imageSrc ? imageSrc : emptyPlaceholder}
        alt={"place holder image"}
        draggable={false}
      />
      <Text fontSize={"xl"}>{description}</Text>
      <Button
        variant="outline"
        rounded={"full"}
        onClick={onClick}
        colorScheme={"blue"}
      >
        {buttonText}
      </Button>
    </Flex>
  );
};

export default PlaceholderCTA;

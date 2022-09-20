import React from "react";
import { IoFileTrayOutline } from "react-icons/io5";
import { Text } from "@chakra-ui/react";

type Props = {
  description: string;
};

const EmptyPlaceHolder = ({ description }: Props) => {
  return (
    <Text color={"gray.500"} align={"center"}>
      <IoFileTrayOutline fontSize={45} style={{ margin: "auto" }} />
      {description}
    </Text>
  );
};

export default EmptyPlaceHolder;

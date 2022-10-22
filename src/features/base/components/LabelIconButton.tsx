import React from "react";
import { IconButton, IconButtonProps, Tooltip } from "@chakra-ui/react";

const LabelIconButton = (props: IconButtonProps) => {
  return (
    <Tooltip label={props["aria-label"]}>
      <IconButton {...props} />
    </Tooltip>
  );
};
export default LabelIconButton;

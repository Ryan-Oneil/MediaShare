import React from "react";
import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";

const NotificationButton = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label={"Notifications"}
          icon={<FaBell />}
          variant={"ghost"}
          mr={4}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Notifications</PopoverHeader>
        <PopoverBody>No new alerts!</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationButton;

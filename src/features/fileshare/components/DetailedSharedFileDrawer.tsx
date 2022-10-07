import React from "react";
import {
  CloseButton,
  Flex,
  Heading,
  Spacer,
  VStack,
  Text,
  ButtonGroup,
  useMediaQuery,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Drawer,
} from "@chakra-ui/react";
import { SharedLink } from "@/features/dashboard/types/SharedFile";
import { displayBytesInReadableForm } from "@/utils/helpers";
import FileDetail from "@/features/fileshare/components/FileDetail";
import { FaEdit, FaLink, FaTrash } from "react-icons/fa";
import LabelIconButton from "@/features/base/components/LabelIconButton";

interface DetailedSharedFileDrawerProps extends SharedLink {
  onClose: () => void;
}

const InfoSection = ({ title, value }: { title: string; value: string }) => {
  return (
    <Flex w={"100%"} as={"section"}>
      <Heading size={"sm"} color={"rgba(0, 0, 0, 0.4)"}>
        {title}
      </Heading>
      <Spacer />
      <Text fontWeight={"bold"}>{value}</Text>
    </Flex>
  );
};

const DetailedFileInfo = ({
  title,
  size,
  expires,
  files,
  onClose,
}: DetailedSharedFileDrawerProps) => {
  return (
    <Flex
      bg={"white"}
      maxW={{ base: "100%", lg: "30vw", "2xl": "25vw" }}
      direction={"column"}
    >
      <Flex p={5} boxShadow={"inset 0px -1px 0px #F1F1F1"}>
        <Heading fontSize={"2xl"} m={"auto"} pr={24}>
          {title}
        </Heading>
        <Spacer />
        <CloseButton size="lg" m={"auto"} onClick={onClose} />
      </Flex>
      <VStack gap={2} alignItems={"start"} p={4} as={"article"}>
        <Heading size={"md"}>Info</Heading>
        <InfoSection title={"Size"} value={displayBytesInReadableForm(size)} />
        <InfoSection title={"Expires"} value={expires} />
        <Heading size={"md"}>Files</Heading>
        <VStack p={4} w={"100%"} gap={4} as={"ul"}>
          {files.map((file) => (
            <FileDetail {...file} key={file.id} />
          ))}
        </VStack>
      </VStack>
      <ButtonGroup
        variant={"ghost"}
        alignSelf={"center"}
        size={"lg"}
        mt={"auto"}
        p={4}
      >
        <LabelIconButton
          aria-label={"Copy Link"}
          icon={<FaLink fontSize={24} />}
        />
        <LabelIconButton
          aria-label={"Edit Title"}
          icon={<FaEdit fontSize={24} />}
        />
        <LabelIconButton
          aria-label={"Delete"}
          icon={<FaTrash color={"red"} fontSize={24} />}
        />
      </ButtonGroup>
    </Flex>
  );
};

const DetailedSharedFileDrawer = (props: DetailedSharedFileDrawerProps) => {
  const [isLargeDevice] = useMediaQuery(["(min-width: 992px)"]);

  if (isLargeDevice) {
    return <DetailedFileInfo {...props} />;
  }

  return (
    <Drawer onClose={props.onClose} isOpen={true} size={"full"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody>
          <DetailedFileInfo {...props} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DetailedSharedFileDrawer;

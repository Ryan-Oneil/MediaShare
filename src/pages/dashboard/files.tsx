import React from "react";
import BaseAppPage from "@/features/dashboard/components/BaseAppPage";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { SharedLink } from "@/features/dashboard/types/SharedFile";
import { Storage } from "@/features/dashboard/types/DashboardUser";
import { getUserById } from "@/lib/services/userService";
import { FiColumns } from "react-icons/fi";
import {
  getUserIdFromJWT,
  withAuthentication,
} from "@/lib/firebase/wrapperUtils";
import { BiGridAlt } from "react-icons/bi";
import FileCard from "@/features/fileshare/components/FileCard";
import DetailedSharedFileDrawer from "@/features/fileshare/components/DetailedSharedFileDrawer";

const Files = ({
  sharedLinks,
  storage,
}: {
  sharedLinks: [SharedLink];
  storage: Storage;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <BaseAppPage
      title={"Shared Files"}
      used={storage.usedTotal}
      max={storage.max}
    >
      <Flex h={"100%"}>
        <Box flex={1}>
          <Flex
            p={5}
            bg={"white"}
            gap={5}
            boxShadow={"inset 0px -1px 0px #F1F1F1"}
            borderRight={"1px solid"}
            borderColor={"#F1F1F1"}
          >
            <Button variant="outline" rounded={"full"}>
              Share Files
            </Button>
            <Input placeholder={"Search name"} width="auto" rounded={"full"} />
            <Spacer />
            <ButtonGroup isAttached variant="outline">
              <IconButton aria-label={"Show grid"} icon={<BiGridAlt />} />
              <IconButton aria-label={"Show table"} icon={<FiColumns />} />
            </ButtonGroup>
          </Flex>
          <Flex p={5}>
            <FileCard
              id={""}
              files={[
                { name: "test", type: "image", id: "", size: 0 },
                { name: "test", type: "image", id: "", size: 0 },
                { name: "test", type: "image", id: "", size: 0 },
                { name: "test", type: "image", id: "", size: 0 },
                { name: "test", type: "image", id: "", size: 0 },
                { name: "test", type: "image", id: "", size: 0 },
              ]}
              title={"Lecture Files"}
              size={2654156}
              uploaded={new Date().toLocaleDateString()}
              expires={new Date().toLocaleDateString()}
              onClick={onOpen}
            />
          </Flex>
        </Box>
        {isOpen && (
          <DetailedSharedFileDrawer
            id={""}
            title={"Lecture Files"}
            files={[
              {
                name: "testaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                type: "image",
                id: "",
                size: 0,
              },
              { name: "test", type: "image", id: "", size: 0 },
              { name: "test", type: "image", id: "", size: 0 },
              { name: "test", type: "image", id: "", size: 0 },
              { name: "test", type: "image", id: "", size: 0 },
              { name: "test", type: "image", id: "", size: 0 },
            ]}
            size={2654156}
            uploaded={new Date().toLocaleDateString()}
            expires={new Date().toLocaleDateString()}
            onClose={onClose}
          />
        )}
      </Flex>
    </BaseAppPage>
  );
};

export default Files;

export const getServerSideProps = withAuthentication(
  async ({ req }: GetServerSidePropsContext) => {
    const uid = await getUserIdFromJWT(req.cookies.jwt);

    const user = await getUserById(uid, "storage sharedLinks");

    return {
      props: {
        sharedLinks: JSON.parse(JSON.stringify(user.sharedLinks)),
        storage: user.storage,
      },
    };
  }
);

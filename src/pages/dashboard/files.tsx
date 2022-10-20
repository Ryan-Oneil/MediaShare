import React, { useState } from "react";
import BaseAppPage from "@/features/dashboard/components/BaseAppPage";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  SimpleGrid,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
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
import FileUploader from "@/features/gallery/components/FileUploader";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";
import { apiDeleteCall } from "@/utils/axios";
import useDisplayApiError from "@/features/base/hooks/useDisplayApiError";
import { AxiosError } from "axios";

const Files = ({
  sharedLinks,
  storage,
}: {
  sharedLinks: Array<ISharedLink>;
  storage: Storage;
}) => {
  const [storageQuota, setStorageQuota] = useState<Storage>(storage);
  const [activeLinkId, setActiveLinkId] = useState<string>("");
  const [sharedLinksList, setSharedLinksList] =
    useState<Array<ISharedLink>>(sharedLinks);
  const infoPanel = useDisclosure();
  const uploadModal = useDisclosure();
  const { createToast } = useDisplayApiError();

  const deleteLink = (id: string) => {
    const link = sharedLinksList.find((link) => link._id === id) as ISharedLink;

    if (activeLinkId === id) {
      infoPanel.onClose();
      setActiveLinkId("");
    }
    setSharedLinksList((prev) => prev.filter((link) => link._id !== id));

    apiDeleteCall(`/api/share/${link._id}`).catch((err) => {
      createToast("Error deleting link", err);
      setSharedLinksList((prev) => [link, ...prev]);
    });
  };
  console.log(sharedLinksList);
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
            <Button
              variant="outline"
              rounded={"full"}
              onClick={uploadModal.onOpen}
            >
              Share Files
            </Button>
            <Input placeholder={"Search name"} width="auto" rounded={"full"} />
            <Spacer />
            <ButtonGroup isAttached variant="outline">
              <IconButton aria-label={"Show grid"} icon={<BiGridAlt />} />
              <IconButton aria-label={"Show table"} icon={<FiColumns />} />
            </ButtonGroup>
          </Flex>
          <SimpleGrid minChildWidth={"240px"} p={5} gap={5}>
            {sharedLinksList.map((sharedLink) => (
              <FileCard
                key={sharedLink._id}
                {...sharedLink}
                onClick={() => {
                  setActiveLinkId(sharedLink._id);
                  infoPanel.onOpen();
                }}
                onDelete={() => deleteLink(sharedLink._id)}
              />
            ))}
          </SimpleGrid>
        </Box>
        {infoPanel.isOpen && activeLinkId && (
          <DetailedSharedFileDrawer
            {...(sharedLinksList.find(
              (link) => link._id === activeLinkId
            ) as ISharedLink)}
            expires={new Date()}
            onClose={() => {
              infoPanel.onClose();
              setActiveLinkId("");
            }}
            onDelete={() => deleteLink(activeLinkId)}
          />
        )}
      </Flex>
      {uploadModal.isOpen && (
        <FileUploader
          handleUploadFinished={(sharedLink: ISharedLink) => {
            setSharedLinksList((prev) => [sharedLink, ...prev]);
            setActiveLinkId(sharedLink._id);
            setStorageQuota((prev) => ({
              ...prev,
              usedTotal: prev.usedTotal + sharedLink.size,
            }));
            infoPanel.onOpen();
          }}
          quotaSpaceRemaining={storageQuota.max - storageQuota.usedTotal}
          onClose={uploadModal.onClose}
        />
      )}
    </BaseAppPage>
  );
};

export default Files;

export const getServerSideProps = withAuthentication(
  async ({ req }: GetServerSidePropsContext) => {
    const uid = await getUserIdFromJWT(req.cookies.jwt);

    const user = await getUserById(uid, "storage sharedLinks");
    const filteredLinks = user.sharedLinks.filter(
      (link) => link.files.length > 0
    );

    return {
      props: {
        sharedLinks: JSON.parse(JSON.stringify(filteredLinks)),
        storage: user.storage,
      },
    };
  }
);

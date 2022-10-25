import React, { useMemo, useState } from "react";
import BaseAppPage from "@/features/dashboard/components/BaseAppPage";
import {
  Box,
  Button,
  Flex,
  Input,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { Storage } from "@/features/dashboard/types/DashboardUser";
import { getUserById } from "@/lib/services/userService";
import {
  getUserIdFromJWT,
  withAuthentication,
} from "@/lib/firebase/wrapperUtils";
import FileCard from "@/features/fileshare/components/FileCard";
import DetailedSharedFileDrawer from "@/features/fileshare/components/DetailedSharedFileDrawer";
import FileUploader from "@/features/gallery/components/FileUploader";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";
import {
  deleteUsersExpiredSharedLinks,
  isLinkExpired,
} from "@/lib/services/fileshareService";
import useDeleteLinkActions from "@/features/fileshare/hooks/useDeleteLinkActions";
import PlaceholderCTA from "@/features/dashboard/components/PlaceholderCTA";

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
  const [isEditingLink, setIsEditingLink] = useState<boolean>(false);
  const infoPanel = useDisclosure();
  const uploadModal = useDisclosure();
  const { deleteLink, deleteFile } = useDeleteLinkActions(
    sharedLinksList,
    setSharedLinksList
  );

  const activeLink = useMemo(() => {
    return sharedLinksList.find(
      (link) => link._id === activeLinkId
    ) as ISharedLink;
  }, [activeLinkId, sharedLinksList]);

  return (
    <BaseAppPage
      title={"Shared Files"}
      used={storageQuota.usedTotal}
      max={storageQuota.max}
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
          {sharedLinksList.length === 0 && (
            <PlaceholderCTA
              description={"No shared files"}
              buttonText={"Start sharing now"}
              onClick={uploadModal.onOpen}
            />
          )}
        </Box>
        {infoPanel.isOpen && activeLink && (
          <DetailedSharedFileDrawer
            {...activeLink}
            onClose={() => {
              infoPanel.onClose();
              setActiveLinkId("");
            }}
            onDeleteLink={() => deleteLink(activeLinkId)}
            editLinkAction={() => {
              setIsEditingLink(true);
              uploadModal.onOpen();
            }}
            onDeleteFile={(fileId: string) => deleteFile(activeLinkId, fileId)}
          />
        )}
      </Flex>
      {uploadModal.isOpen && (
        <FileUploader
          handleUploadFinished={(sharedLink: ISharedLink) => {
            if (isEditingLink) {
              setSharedLinksList((prev) => {
                const updatedLinks = [...prev];
                const index = updatedLinks.findIndex(
                  (link) => link._id === sharedLink._id
                );
                updatedLinks[index].files.push(...sharedLink.files);
                updatedLinks[index].title = sharedLink.title;

                return updatedLinks;
              });
            } else {
              setSharedLinksList((prev) => [sharedLink, ...prev]);
              setActiveLinkId(sharedLink._id);
            }
            setStorageQuota((prev) => ({
              ...prev,
              usedTotal: prev.usedTotal + sharedLink.size,
            }));
            infoPanel.onOpen();
          }}
          quotaSpaceRemaining={storageQuota.max - storageQuota.usedTotal}
          onClose={() => {
            setIsEditingLink(false);
            uploadModal.onClose();
          }}
          title={isEditingLink ? activeLink.title : ""}
          linkId={isEditingLink ? activeLinkId : ""}
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
      (link) => link.files.length > 0 && !isLinkExpired(link)
    );
    deleteUsersExpiredSharedLinks(uid);

    return {
      props: {
        sharedLinks: JSON.parse(JSON.stringify(filteredLinks)),
        storage: user.storage,
      },
    };
  }
);

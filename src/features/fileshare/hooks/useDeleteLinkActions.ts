import { ISharedLink } from "@/lib/mongoose/model/SharedLink";
import { apiDeleteCall } from "@/utils/axios";
import useDisplayApiError from "@/features/base/hooks/useDisplayApiError";

const useDeleteLinkActions = (
  sharedLinksList: ISharedLink[],
  updateSharedLinksList: (sharedLinksList: ISharedLink[]) => void
) => {
  const { createToast } = useDisplayApiError();

  const deleteLink = (id: string) => {
    const link = sharedLinksList.find(
      (sharedLink) => sharedLink._id === id
    ) as ISharedLink;

    const newSharedLinksList = sharedLinksList.filter(
      (sharedLink) => sharedLink._id !== id
    );
    updateSharedLinksList(newSharedLinksList);

    return apiDeleteCall(`/api/share/${link._id}`).catch((err) => {
      createToast("Error deleting link", err);
      updateSharedLinksList([link, ...sharedLinksList]);
    });
  };

  const deleteFile = (linkId: string, fileId: string) => {
    const linkIndex = sharedLinksList.findIndex(
      (sharedLink) => sharedLink._id === linkId
    );

    //Delete shared link if it's the last file
    if (sharedLinksList[linkIndex].files.length === 1) {
      return deleteLink(linkId);
    }

    const links = [...sharedLinksList];
    links[linkIndex].files = links[linkIndex].files.filter(
      (file) => file._id !== fileId
    );
    updateSharedLinksList(links);

    return apiDeleteCall(`/api/share/file/${fileId}`).catch((err) => {
      createToast("Error deleting file", err);
    });
  };

  return { deleteLink, deleteFile };
};

export default useDeleteLinkActions;

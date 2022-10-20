import { useToast } from "@chakra-ui/react";
import { getApiError } from "@/utils/axios";
import { AxiosError } from "axios";

const useDisplayApiError = () => {
  const toast = useToast();

  const createToast = (title: string, error: AxiosError) => {
    const apiError = getApiError(error);
    const toastId = title + apiError;

    if (!toast.isActive(toastId)) {
      toast({
        id: toastId,
        title: title,
        description: apiError,
        status: "error",
        isClosable: true,
        duration: 2000,
      });
    }
  };
  return { createToast };
};
export default useDisplayApiError;

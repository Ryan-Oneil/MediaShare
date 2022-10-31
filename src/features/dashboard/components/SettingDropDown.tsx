import React from "react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { IconButton, useToast } from "@chakra-ui/react";
import { FaCog } from "react-icons/fa";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { HOMEPAGE_URL } from "@/utils/urls";
import { useRouter } from "next/router";

const SettingDropDown = () => {
  const router = useRouter();
  const toast = useToast();
  const [resetEmailSent, setResetEmailSent] = React.useState(false);

  return (
    <Menu>
      <MenuButton as={IconButton} icon={<FaCog />} variant={"ghost"} />
      <MenuList>
        <MenuItem
          isDisabled={resetEmailSent}
          onClick={() => {
            const auth = getAuth();
            setResetEmailSent(true);

            sendPasswordResetEmail(auth, auth.currentUser?.email as string)
              .then(() => {
                toast({
                  title: "Password reset",
                  description: "Password reset email sent",
                  status: "success",
                  isClosable: true,
                  duration: 1000,
                });
              })
              .catch((error) => {
                setResetEmailSent(false);
                const errorMessage = error.message;

                toast({
                  title: "Password reset",
                  description: errorMessage,
                  status: "error",
                  isClosable: true,
                  duration: 2000,
                });
              });
          }}
        >
          Reset Password
        </MenuItem>
        <MenuItem
          onClick={() => {
            getAuth()
              .signOut()
              .then(() => router.push(HOMEPAGE_URL));
          }}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default SettingDropDown;

import React from "react";
import BaseAuthPage from "../../features/Auth/components/BaseAuthPage";
import { Card } from "../../features/base/components/Card";
import FileList from "../../features/fileshare/components/FileList";
import { Button, Center } from "@chakra-ui/react";

const Share = () => {
  return (
    <BaseAuthPage
      title={"File sharing made simple with"}
      backgroundColor={"#FAFAFA"}
      shouldRedirect={false}
    >
      <Card m={"auto"} rounded={10} p={5} mt={10}>
        <FileList />
        <Center mt={5}>
          <Button>Download All</Button>
        </Center>
      </Card>
    </BaseAuthPage>
  );
};

export default Share;

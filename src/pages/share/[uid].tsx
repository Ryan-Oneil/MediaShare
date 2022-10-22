import React from "react";
import BaseAuthPage from "@/features/Auth/components/BaseAuthPage";
import { Card } from "@/features/base/components/Card";
import FileList from "@/features/fileshare/components/FileList";
import { Heading } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { getSharedLink } from "@/lib/services/fileshareService";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";

const Share = ({ sharedLink }: { sharedLink: ISharedLink }) => {
  return (
    <BaseAuthPage
      title={"File sharing made simple with"}
      backgroundColor={"#FAFAFA"}
      shouldRedirect={false}
    >
      <Card m={"auto"} rounded={10} p={5} mt={20} maxW={"xl"}>
        {sharedLink.title && (
          <Heading fontSize={"2xl"} pb={5}>
            {sharedLink.title}
          </Heading>
        )}
        <FileList {...sharedLink} />
      </Card>
    </BaseAuthPage>
  );
};

export default Share;

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  try {
    const link = await getSharedLink(query.uid as string);

    return {
      props: {
        sharedLink: JSON.parse(JSON.stringify(link)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

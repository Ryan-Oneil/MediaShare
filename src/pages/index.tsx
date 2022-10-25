import type { NextPage } from "next";
import {
  Button,
  Heading,
  Stack,
  useBreakpointValue,
  Text,
  VStack,
} from "@chakra-ui/react";
import { REGISTER_URL } from "@/utils/urls";
import Link from "next/link";
import Image from "next/image";
import dashboardPicture from "../../public/dashboardMock.png";
import BaseHomePage from "@/features/base/components/BaseHomePage";

const Home: NextPage = () => {
  return (
    <BaseHomePage title={"Home"}>
      <VStack
        spacing={{ base: "8", md: "10" }}
        align="center"
        mb={{ base: 10, "2xl": 28 }}
      >
        <Stack spacing={{ base: "4", md: "5" }} align="center">
          <Heading size={useBreakpointValue({ base: "lg", "2xl": "2xl" })}>
            Sharing media made simple
          </Heading>
          <Text
            color="muted"
            maxW="2xl"
            textAlign="center"
            fontSize={useBreakpointValue({ base: "lg", "2xl": "2xl" })}
          >
            Media share brings the ease to sharing files and media around the
            world. Hassle free! Supported by powerful APIs
          </Text>
        </Stack>

        <Link href={REGISTER_URL}>
          <Button size="md" variant={"brand"} w={"40%"} m={"auto"}>
            Try now
          </Button>
        </Link>
      </VStack>
      <Image
        src={dashboardPicture}
        draggable={false}
        alt={"Picture of dashboard application"}
      />
    </BaseHomePage>
  );
};

export default Home;

import React from "react";
import BaseHomePage from "@/features/base/components/BaseHomePage";
import { PricingCard } from "@/features/base/components/PriceCard";
import { Box, Heading, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import { FaSuitcase, FaTag, FaTags } from "react-icons/fa";
import PricePlan, { IPricePlan } from "@/lib/mongoose/model/PricePlan";
import dbConnect from "@/lib/mongoose";

type PriceProps = {
  plans: IPricePlan[];
};

const icons = [FaTag, FaTags, FaSuitcase];

const Price = ({ plans }: PriceProps) => {
  return (
    <BaseHomePage title={"Pricing"}>
      <Box as="section" bg={"gray.50"} px={{ base: "4", md: "8" }}>
        <VStack spacing={2} textAlign="center" mb={10}>
          <Heading as="h1" fontSize={{ base: "xl", "2xl": "4xl" }}>
            Plans that fit your need
          </Heading>
          <Text fontSize={{ base: "md", "2xl": "lg" }} color={"gray.500"}>
            Sign up for free or commit to a monthly subscription that can be
            cancelled at anytime
          </Text>
        </VStack>
        <SimpleGrid
          columns={{ base: 1, lg: 3 }}
          spacing={{ base: "8", lg: "0" }}
          maxW="7xl"
          mx="auto"
          justifyItems="center"
          alignItems="center"
        >
          {plans.map((plan, index) => {
            return <PricingCard plan={plan} icon={icons[index]} key={index} />;
          })}
        </SimpleGrid>
      </Box>
    </BaseHomePage>
  );
};
export default Price;

export async function getStaticProps() {
  await dbConnect();
  const plans = await PricePlan.find({}).lean().exec();

  return {
    props: { plans },
  };
}

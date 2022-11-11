import React, { useEffect } from "react";
import BaseHomePage from "@/features/base/components/BaseHomePage";
import { PricingCard } from "@/features/base/components/PriceCard";
import { Box, Heading, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import { FaSuitcase, FaTag, FaTags } from "react-icons/fa";
import PricePlan, { IPricePlan } from "@/lib/mongoose/model/PricePlan";
import dbConnect from "@/lib/mongoose";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { apiGetCall } from "@/utils/axios";

type PriceProps = {
  plans: IPricePlan[];
};

const icons = [FaTag, FaTags, FaSuitcase];

const Price = ({ plans }: PriceProps) => {
  const [plansState, setPlansState] = React.useState(plans);
  const [activePlanId, setActivePlanId] = React.useState(plans[0]._id);
  const user = useAuth();

  useEffect(() => {
    if (user) {
      apiGetCall("/api/stripe/subscription").then(({ data }) => {
        if (data !== "none") {
          setPlansState((plans) =>
            plans.map((plan) => {
              return { ...plan, disabled: true };
            })
          );
        }
        setActivePlanId(data);
      });
    }
  }, [user]);

  return (
    <BaseHomePage title={"Pricing"}>
      <Box as="section" bg={"gray.50"} px={{ base: "4", md: "8" }}>
        <VStack spacing={2} textAlign="center" my={14}>
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
          {plansState.map((plan, index) => {
            return (
              <PricingCard
                plan={plan}
                icon={icons[index]}
                key={index}
                active={activePlanId === plan._id}
              />
            );
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

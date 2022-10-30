import React from "react";
import { Button, Heading } from "@chakra-ui/react";
import { PricingTier } from "@/features/base/components/PriceCard";
import { Card } from "@/features/base/components/Card";

const CurrentPlanCard = () => {
  return (
    <Card p={6} rounded={10} maxW={"100%"} alignSelf={"flex-start"}>
      <Heading size={"md"} textAlign={"start"} mb={10}>
        Current Plan
      </Heading>
      <PricingTier
        data={{
          price: "€0",
          name: "Free Tier",
          features: [
            "5GB Storage Limit",
            "7 day file share expiration",
            "ShareX API Access",
            "Unlimited Media expiry",
          ],
        }}
      />
      <Button w={"100%"} variant={"brand"}>
        Change
      </Button>
    </Card>
  );
};

export default CurrentPlanCard;

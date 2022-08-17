import React from "react";
import { Heading } from "@chakra-ui/react";
import { PricingTier } from "../../base/components/PriceCard";
import { Card } from "../../base/components/Card";

const CurrentPlanCard = () => {
  return (
    <Card p={6} rounded={10} maxW={"fit-content"}>
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
    </Card>
  );
};

export default CurrentPlanCard;

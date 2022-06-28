import React from "react";
import {
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Heading,
  Text,
} from "@chakra-ui/react";
import { PricingTier } from "../../base/components/PriceCard";
import { Card } from "../../base/components/Card";

const StorageDetailCard = () => {
  return (
    <Card p={6} rounded={10} maxW={"fit-content"}>
      <Heading size={"md"} textAlign={"start"}>
        Storage Details
      </Heading>
      <CircularProgress value={40} color="blue.400" size={200} p={10}>
        <CircularProgressLabel fontSize={"2xl"} fontWeight={"extrabold"}>
          2 <Text>of 5GB</Text>
        </CircularProgressLabel>
      </CircularProgress>
      <Divider mb={10} />
      <Heading size={"md"} textAlign={"center"} mb={2}>
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

export default StorageDetailCard;

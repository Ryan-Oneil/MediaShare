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
import { displayBytesInReadableForm } from "../../../utils/helpers";

type props = {
  usedStorage: number;
  maxStorage: number;
};

const StorageDetailCard = ({ usedStorage, maxStorage }: props) => {
  const percentageUsed = (usedStorage / maxStorage) * 100;

  return (
    <Card p={6} rounded={10} maxW={"fit-content"}>
      <Heading size={"md"} textAlign={"start"}>
        Storage Details
      </Heading>
      <CircularProgress
        value={Math.ceil(percentageUsed)}
        color="blue.400"
        size={200}
        p={10}
      >
        <CircularProgressLabel fontSize={"2xl"} fontWeight={"extrabold"}>
          {displayBytesInReadableForm(usedStorage)}
          <Text>of {displayBytesInReadableForm(maxStorage)}</Text>
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

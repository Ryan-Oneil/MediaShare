import React from "react";
import BaseHomePage from "@/features/base/components/BaseHomePage";
import { PricingCard } from "@/features/base/components/PriceCard";
import { Box, Heading, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import { FaSuitcase, FaTag, FaTags } from "react-icons/fa";
import { NextPage } from "next";

const Price: NextPage = () => {
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
          <PricingCard
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
            icon={FaTag}
          />
          <PricingCard
            zIndex={1}
            transform={{ lg: "scale(1.05)" }}
            data={{
              price: "€20",
              name: "Pro Tier",
              features: [
                "100GB Storage Limit",
                "Unlimited file share expiration",
                "ShareX API Access",
                "Unlimited Media expiry",
              ],
            }}
            buttonProps={{ variant: "outline", borderWidth: "2px" }}
            icon={FaSuitcase}
          />
          <PricingCard
            data={{
              price: "€10",
              name: "Starter Tier",
              features: [
                "50GB Storage Limit",
                "30 day file share expiration",
                "ShareX API Access",
                "Unlimited Media expiry",
              ],
            }}
            icon={FaTags}
          />
        </SimpleGrid>
      </Box>
    </BaseHomePage>
  );
};
export default Price;

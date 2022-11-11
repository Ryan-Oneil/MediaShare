import {
  BoxProps,
  Button,
  Flex,
  Heading,
  Icon,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { HiCheckCircle } from "react-icons/hi";
import { Card } from "./Card";
import { IPricePlan } from "@/lib/mongoose/model/PricePlan";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useRouter } from "next/router";
import { apiPostCall } from "@/utils/axios";
import { getStripe } from "@/lib/stripe/client";
import useDisplayApiError from "@/features/base/hooks/useDisplayApiError";

interface PricingCardProps {
  plan: IPricePlan;
  icon?: React.ElementType;
  active?: boolean;
}

export const PricingCard = (props: PricingCardProps) => {
  const user = useAuth();
  const router = useRouter();
  const { createToast } = useDisplayApiError();
  const [loading, setLoading] = React.useState(false);
  const { plan, icon, active } = props;
  const extraProperties = {} as BoxProps;

  if (plan.highlight) {
    extraProperties["transform"] = { lg: "scale(1.05)" };
    extraProperties["zIndex"] = 1;
  }

  const handleSubscribe = async () => {
    setLoading(true);
    if (!user) {
      return router.push("/login?redirect=/price");
    }

    if (active) {
      return router.push("/dashboard");
    }

    try {
      const { data } = await apiPostCall(
        "/api/stripe/create-checkout-session",
        {
          planId: plan._id,
        }
      );

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId: data });
    } catch (error: any) {
      createToast("Error redirecting to stripe checkout", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card px="6" pb="6" pt="12" rounded={{ sm: "xl" }} {...extraProperties}>
      <PricingTier plan={plan} icon={icon} />
      <Button
        fontWeight={600}
        variant={"brand"}
        size={{ base: "md", "2xl": "lg" }}
        w="full"
        disabled={(plan.disabled && !active) || loading}
        onClick={handleSubscribe}
      >
        {active ? "Manage" : "Subscribe"}
      </Button>
    </Card>
  );
};

export const PricingTier = ({ icon, plan }: PricingCardProps) => {
  const { features, price, name } = plan;

  return (
    <>
      <VStack spacing={6}>
        {icon && (
          <Icon aria-hidden as={icon} fontSize="4xl" color={"brand.100"} />
        )}
        <Heading size="md" fontWeight="extrabold">
          {name}
        </Heading>
      </VStack>
      <Flex
        align="flex-end"
        justify="center"
        fontWeight="extrabold"
        color={"brand.100"}
        my="8"
      >
        <Heading size="xl" fontWeight="inherit" lineHeight="0.9em" pr={1}>
          {price}
        </Heading>
        <Text
          fontWeight="inherit"
          fontSize="xl"
          color={"#121127"}
          opacity={"50%"}
        >
          / Monthly
        </Text>
      </Flex>
      <List spacing="4" mb="8" maxW="28ch" mx="auto">
        {features.map((feature, index) => (
          <ListItem fontWeight="medium" key={index}>
            <ListIcon
              fontSize={{ base: "lg", "2xl": "xl" }}
              as={HiCheckCircle}
              marginEnd={2}
              color={"brand.100"}
            />
            {feature}
          </ListItem>
        ))}
      </List>
    </>
  );
};

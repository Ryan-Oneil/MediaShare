import {
  BoxProps,
  Button,
  ButtonProps,
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

export interface PricingCardData {
  features: string[];
  name: string;
  price: string;
}

interface PricingCardProps extends BoxProps {
  data: PricingCardData;
  icon?: React.ElementType;
  buttonProps?: ButtonProps;
}

export const PricingCard = (props: PricingCardProps) => {
  const { data, icon, buttonProps, ...rest } = props;

  return (
    <Card px="6" pb="6" pt="12" rounded={{ sm: "xl" }} {...rest}>
      <PricingTier data={data} icon={icon} buttonProps={buttonProps} />
      <Button
        fontWeight={600}
        variant={"brand"}
        size={{ base: "md", "2xl": "lg" }}
        w="full"
        {...buttonProps}
      >
        Purchase
      </Button>
    </Card>
  );
};

export const PricingTier = ({ icon, data }: PricingCardProps) => {
  const { features, price, name } = data;

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

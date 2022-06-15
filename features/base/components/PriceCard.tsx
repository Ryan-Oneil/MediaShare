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
  icon: React.ElementType;
  buttonProps?: ButtonProps;
}

export const PricingCard = (props: PricingCardProps) => {
  const { data, icon, buttonProps, ...rest } = props;
  const { features, price, name } = data;
  const accentColor = "#1A202C";

  return (
    <Card rounded={{ sm: "xl" }} {...rest}>
      <VStack spacing={6}>
        <Icon aria-hidden as={icon} fontSize="4xl" color={accentColor} />
        <Heading size="md" fontWeight="extrabold">
          {name}
        </Heading>
      </VStack>
      <Flex
        align="flex-end"
        justify="center"
        fontWeight="extrabold"
        color={accentColor}
        my="8"
      >
        <Heading size="3xl" fontWeight="inherit" lineHeight="0.9em">
          {price}
        </Heading>
        <Text fontWeight="inherit" fontSize="2xl">
          / Monthly
        </Text>
      </Flex>
      <List spacing="4" mb="8" maxW="28ch" mx="auto">
        {features.map((feature, index) => (
          <ListItem fontWeight="medium" key={index}>
            <ListIcon
              fontSize="xl"
              as={HiCheckCircle}
              marginEnd={2}
              color={accentColor}
            />
            {feature}
          </ListItem>
        ))}
      </List>
      <Button
        fontWeight={600}
        color={"white"}
        bg={"#1A202C"}
        _hover={{
          bg: "#2a3448",
        }}
        size="lg"
        w="full"
        py={{ md: "8" }}
        {...buttonProps}
      >
        Purchase
      </Button>
    </Card>
  );
};

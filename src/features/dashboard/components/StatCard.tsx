import React from "react";
import { Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/stat";
import { Card } from "@/features/base/components/Card";

type props = {
  title: string;
  value: string;
  description?: string;
};

const StatCard = ({ title, value, description }: props) => {
  return (
    <Card rounded={10} p={6}>
      <Stat>
        <StatLabel fontSize={"lg"}>{title}</StatLabel>
        <StatNumber py={2}>{value}</StatNumber>
        {description && <StatHelpText>{description}</StatHelpText>}
      </Stat>
    </Card>
  );
};

export default StatCard;

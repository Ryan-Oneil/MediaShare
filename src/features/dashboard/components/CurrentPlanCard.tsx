import React from "react";
import { Button, Heading } from "@chakra-ui/react";
import { PricingTier } from "@/features/base/components/PriceCard";
import { Card } from "@/features/base/components/Card";
import { apiGetCall, apiPostCall } from "@/utils/axios";
import useDisplayApiError from "@/features/base/hooks/useDisplayApiError";
import { IPricePlan } from "@/lib/mongoose/model/PricePlan";

const CurrentPlanCard = (plan: IPricePlan) => {
  const [loading, setLoading] = React.useState(false);
  const { createToast } = useDisplayApiError();

  const redirectToCustomerPortal = () => {
    setLoading(true);

    return apiGetCall("/api/stripe/create-portal-link")
      .then(({ data }) => {
        window.location.assign(data);
      })
      .catch((error) => {
        createToast("Error redirecting to stripe portal", error);
        setLoading(false);
      });
  };

  return (
    <Card p={6} rounded={10} maxW={"100%"} alignSelf={"flex-start"}>
      <Heading size={"md"} textAlign={"start"} mb={10}>
        Current Plan
      </Heading>
      <PricingTier plan={plan} />
      <Button
        w={"100%"}
        variant={"brand"}
        disabled={loading}
        onClick={redirectToCustomerPortal}
      >
        Manage
      </Button>
    </Card>
  );
};

export default CurrentPlanCard;

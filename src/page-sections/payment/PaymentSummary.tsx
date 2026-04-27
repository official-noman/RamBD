"use client";

import { Card1 } from "@component/Card1";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import Typography from "@component/Typography";
import { useAppContext } from "@context/app-context";
import { useEffect, useState } from "react";
import { currency } from "@utils/utils";

export default function CheckoutSummary() {
  const { state } = useAppContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getTotalPrice = () => {
    return state.cart.reduce((accumulator, item) => accumulator + item.price * item.qty, 0) || 0;
  };

  return (
    <Card1>
      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Subtotal:</Typography>

        <Typography fontSize="18px" fontWeight="600" lineHeight="1">
          {isMounted ? currency(getTotalPrice()) : currency(0)}
        </Typography>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Shipping:</Typography>

        <Typography fontSize="18px" fontWeight="600" lineHeight="1">
          -
        </Typography>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Tax:</Typography>

        <Typography fontSize="18px" fontWeight="600" lineHeight="1">
          {currency(0)}
        </Typography>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">
        <Typography color="text.hint">Discount:</Typography>

        <Typography fontSize="18px" fontWeight="600" lineHeight="1">
          -
        </Typography>
      </FlexBox>

      <Divider mb="1rem" />

      <Typography fontSize="25px" fontWeight="600" lineHeight="1" textAlign="right">
        {isMounted ? currency(getTotalPrice()) : currency(0)}
      </Typography>
    </Card1>
  );
}

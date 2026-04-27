"use client";

import Link from "next/link";
import Image from "next/image";
import Box from "@component/Box";
import { Card1 } from "@component/Card1";
import Avatar from "@component/avatar";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button, IconButton } from "@component/buttons";
import Typography from "@component/Typography";
import CheckBox from "@component/CheckBox";
import Icon from "@component/icon/Icon";
import { useAppContext } from "@context/app-context";
import { useEffect, useState } from "react";
import { currency } from "@utils/utils";
import { CartItem } from "@context/app-context/types";
import { theme } from "@utils/theme";

import Swal from "sweetalert2";

export default function CheckoutSummary({ formik }: { formik: any }) {
  const { state, dispatch } = useAppContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { values, setFieldValue, handleSubmit, handleChange } = formik;

  const showDisabledPaymentNotice = () => {
    Swal.fire({
      icon: 'info',
      title: 'Sorry!',
      text: 'Online Payment and bKash are currently unavailable. Please use Cash On Delivery to complete your order.',
      confirmButtonText: 'OK',
      confirmButtonColor: theme.colors.primary.main
    });
  };

  const getTotalPrice = () => {
    return state.cart.reduce((accumulator, item) => accumulator + item.price * item.qty, 0) || 0;
  };

  const getTotalOriginalPrice = () => {
    return state.cart.reduce((accumulator, item) => accumulator + (item.regularPrice || item.originalPrice || item.price) * item.qty, 0) || 0;
  };

  const totalDiscount = getTotalOriginalPrice() - getTotalPrice();

  const handleQuantityChange = (item: CartItem, amount: number) => () => {
    if (amount < 1) return;
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { ...item, qty: amount }
    });
  };

  const handleRemoveItem = (item: CartItem) => () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { ...item, qty: 0 }
    });
  };

  return (
    <Card1>
      <FlexBox justifyContent="space-between" mb="1rem">
        <Typography fontSize="14px" fontWeight="600" color="text.muted">Product</Typography>
        <FlexBox>
          <Typography fontSize="14px" fontWeight="600" color="text.muted" mr="2rem">Qty</Typography>
          <Typography fontSize="14px" fontWeight="600" color="text.muted">Price</Typography>
        </FlexBox>
      </FlexBox>

      <Divider mb="1rem" />

      <Box mb="1.5rem">
        {isMounted && state.cart.map((item) => (
          <FlexBox justifyContent="space-between" alignItems="center" mb="1.5rem" key={item.id}>
            <FlexBox alignItems="center" flex="1" minWidth="0">
              <IconButton
                size="small"
                p="2px"
                onClick={handleRemoveItem(item)}
                style={{ marginRight: 6, color: "#e74c3c", flexShrink: 0 }}
              >
                <Icon size="12px">close</Icon>
              </IconButton>

              <Link href={`/pro/${item.slug || item.id}`} style={{ display: "flex", alignItems: "center", minWidth: 0, textDecoration: "none" }}>
                <Avatar
                  src={item.imgUrl || "/assets/images/products/iphone-x.png"}
                  size={40}
                  mr="8px"
                />
                <Typography fontSize="13px" fontWeight="600" maxWidth="120px" color="text.primary" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.name}
                </Typography>
              </Link>
            </FlexBox>

            <FlexBox alignItems="center" flexShrink={0}>
              <FlexBox
                alignItems="stretch"
                borderRadius="4px"
                mr="1rem"
                style={{ border: `1px solid ${theme.colors.gray[300]}`, height: 28, overflow: "hidden" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="none"
                  p="4px"
                  onClick={handleQuantityChange(item, item.qty - 1)}
                  disabled={item.qty <= 1}
                  style={{ borderRadius: 0, minWidth: 28 }}>
                  <Icon size="10px">minus</Icon>
                </Button>

                <FlexBox alignItems="center" justifyContent="center" px="8px" bg="white">
                  <Typography fontSize="12px" fontWeight="600" color="text.primary">
                    {item.qty}
                  </Typography>
                </FlexBox>

                <Button
                  variant="contained"
                  color="primary"
                  size="none"
                  p="4px"
                  onClick={handleQuantityChange(item, item.qty + 1)}
                  style={{ borderRadius: 0, minWidth: 28 }}>
                  <Icon size="10px">plus</Icon>
                </Button>
              </FlexBox>

              <Typography fontSize="14px" fontWeight="600" color="primary.main" minWidth="55px" textAlign="right">
                {currency(item.price * item.qty, 0)}
              </Typography>
            </FlexBox>
          </FlexBox>
        ))}
      </Box>

      <Divider mb="1rem" mt="0.5rem" />

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.75rem">
        <Typography fontSize="14px" fontWeight="600">Subtotal</Typography>
        <Typography fontSize="14px" fontWeight="600">
          {isMounted ? currency(getTotalOriginalPrice(), 0) : currency(0)}
        </Typography>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.75rem">
        <Typography fontSize="14px" fontWeight="600">Discount</Typography>
        <Typography fontSize="14px" fontWeight="600" color="primary.main">
          {isMounted ? `-${currency(totalDiscount, 0)}` : currency(0)}
        </Typography>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.75rem">
        <Typography fontSize="14px" fontWeight="600">Shipping Cost</Typography>
        <Typography fontSize="14px" fontWeight="600" color="primary.main">
          {currency(values.shipping_cost || 0, 0)}
        </Typography>
      </FlexBox>

      <Divider mb="1rem" />

      <FlexBox justifyContent="space-between" alignItems="center" mb="1.5rem">
        <Typography fontSize="16px" fontWeight="700">Total Payable</Typography>
        <Typography fontSize="16px" fontWeight="700" color="primary.main">
          {isMounted ? `${currency(getTotalPrice() + (values.shipping_cost || 0), 0)} TK` : currency(0)}
        </Typography>
      </FlexBox>

      <Box mb="2rem" mt="1rem">
        <Typography fontSize="16px" fontWeight="700" color="text.primary" mb="1rem">
          Payment Method:
        </Typography>

        <FlexBox flexDirection="row" flexWrap="wrap" style={{ gap: 10 }}>
          <Box
            flex="1"
            minWidth="0"
            p="10px 8px"
            borderRadius="8px"
            cursor="pointer"
            style={{
              border: values.payment_method === "cod" ? "2px solid #2ba56d" : "1px solid #dee2e6",
              background: values.payment_method === "cod" ? "#f0faf5" : "transparent",
              transition: "all 0.2s ease"
            }}
            onClick={() => setFieldValue("payment_method", "cod")}
          >
            <FlexBox alignItems="center">
              <Box
                width="16px"
                height="16px"
                borderRadius="50%"
                mr="8px"
                flexShrink={0}
                style={{
                  border: values.payment_method === "cod" ? "5px solid #2ba56d" : "2px solid #adb5bd",
                  transition: "all 0.2s ease"
                }}
              />
              <Typography fontSize="12px" fontWeight="600" color="text.primary">
                Cash On Delivery
              </Typography>
            </FlexBox>
          </Box>

          <Box
            flex="1"
            minWidth="0"
            p="10px 8px"
            borderRadius="8px"
            cursor="not-allowed"
            style={{
              border: "1px solid #dee2e6",
              background: "transparent",
              opacity: 0.6,
              transition: "all 0.2s ease"
            }}
            onClick={showDisabledPaymentNotice}
          >
            <FlexBox alignItems="center">
              <Box
                width="16px"
                height="16px"
                borderRadius="50%"
                mr="8px"
                flexShrink={0}
                style={{
                  border: "2px solid #adb5bd",
                  transition: "all 0.2s ease"
                }}
              />
              <Typography fontSize="12px" fontWeight="600" color="text.primary">
                Online Payment
              </Typography>
            </FlexBox>
          </Box>

          <Box
            flex="1"
            minWidth="0"
            p="10px 8px"
            borderRadius="8px"
            cursor="not-allowed"
            style={{
              border: "1px solid #dee2e6",
              background: "transparent",
              opacity: 0.6,
              transition: "all 0.2s ease"
            }}
            onClick={showDisabledPaymentNotice}
          >
            <FlexBox alignItems="center">
              <Box
                width="16px"
                height="16px"
                borderRadius="50%"
                mr="8px"
                flexShrink={0}
                style={{
                  border: "2px solid #adb5bd",
                  transition: "all 0.2s ease"
                }}
              />
              <Typography fontSize="12px" fontWeight="600" color="text.primary" mr="6px">
                bKash
              </Typography>
              <Image
                src="/assets/images/payment-logos/bkash.png"
                alt="bkash"
                width={30}
                height={13}
                unoptimized
                style={{ objectFit: "contain" }}
                onError={(e: any) => (e.target.style.display = "none")}
              />
            </FlexBox>
          </Box>
        </FlexBox>

        {/* Notice for disabled payment methods */}
        <Box mt="1rem" p="10px" borderRadius="8px" bg="#fff9f0" style={{ border: "1px solid #ffeeba" }}>
          <Typography fontSize="11px" fontWeight="600" color="#856404" textAlign="center">
            Online Payment and bKash are currently unavailable. Please use Cash On Delivery to complete your order.
          </Typography>
        </Box>
      </Box>

      <Box mb="1.5rem" p="10px" borderRadius="8px" bg="gray.100">
        <CheckBox
          name="agree"
          color="primary"
          onChange={handleChange}
          checked={values.agree}
          label={
            <Typography
              fontSize="13px"
              color="#000000"
              sx={{ cursor: "pointer", userSelect: "none", fontWeight: 600, display: "block" }}>
              I have read and agree to the{" "}
              <Link href="/terms-and-conditions" style={{ color: "#000000", textDecoration: "underline", fontWeight: 700 }}>terms and conditions</Link>,{" "}
              <Link href="/privacy-policy" style={{ color: "#000000", textDecoration: "underline", fontWeight: 700 }}>privacy policy</Link> &{" "}
              <Link href="/refund-policy" style={{ color: "#000000", textDecoration: "underline", fontWeight: 700 }}>refund policy</Link>
            </Typography>
          }
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullwidth
        size="large"
        onClick={handleSubmit}
        disabled={!values.agree || state.cart.length === 0}
        style={{ borderRadius: "8px", height: "50px", fontSize: "16px", fontWeight: "700" }}
      >
        Proceed To Confirm Order
      </Button>
    </Card1>
  );
}

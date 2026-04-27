"use client";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
// GLOBAL CUSTOM COMPONENTS
import Box from "@component/Box";
import Select from "@component/Select";
import Grid from "@component/grid/Grid";
import { Card1 } from "@component/Card1";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import LazyImage from "@component/LazyImage";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Typography from "@component/Typography";
// CUSTOM HOOK
import { useAppContext } from "@context/app-context";
// CUSTOM DATA
import countryList from "@data/countryList";
// UTILS
import { currency } from "@utils/utils";

const float = keyframes`
  0% { transform: translateY(-50%) translateX(0); }
  50% { transform: translateY(-60%) translateX(-5px); }
  100% { transform: translateY(-50%) translateX(0); }
`;

const wiggle = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
`;

const StyledSticker = styled(Box)`
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-right: none;
  border-radius: 24px 0 0 24px;
  padding: 12px 8px 12px 14px;
  color: white;
  animation: ${float} 4s ease-in-out infinite;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.15);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%);
    opacity: 0.85;
    z-index: -1;
    border-radius: inherit;
  }

  &:hover {
    padding-left: 20px;
    transform: translateY(-50%) translateX(-5px) scale(1.05);
    box-shadow: -15px 15px 40px rgba(244, 114, 182, 0.3);
    
    .cart-icon {
      animation: ${wiggle} 0.5s ease-in-out infinite;
    }
  }

  .items-badge {
    background: white;
    color: #f472b6;
    font-weight: 800;
    box-shadow: 0 4px 10px rgba(244, 114, 182, 0.2);
  }
`;

import Container from "@component/Container";

export default function Cart() {
  const { state, dispatch } = useAppContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getTotalPrice = () => {
    return state?.cart?.reduce((accumulator, item) => accumulator + item.price * item.qty, 0) || 0;
  };

  const handleCartAmountChange = (amount: number, item: any) => () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { ...item, qty: amount }
    });
  };

  const cartList = state?.cart || [];

  return (
    <Container mb="2px" mt="2px" p="0" style={{ marginLeft: "2px", padding: 0, maxWidth: "100%" }}>
      <Grid container spacing={2}>
        <Grid item lg={8} md={8} xs={12}>
          <Box
            bg="white"
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.300"
            overflow="hidden">
            <Box px="1rem" py="0.5rem" bg="gray.100" borderBottom="1px solid" borderColor="gray.300">
              <Grid container spacing={2}>
                <Grid item md={5} xs={5}>
                  <Typography fontWeight="600" fontSize="14px">
                    Name
                  </Typography>
                </Grid>
                <Grid item md={2} xs={2}>
                  <Typography fontWeight="600" fontSize="14px" textAlign="center">
                    Price
                  </Typography>
                </Grid>
                <Grid item md={3} xs={3}>
                  <Typography fontWeight="600" fontSize="14px" textAlign="center">
                    Qty
                  </Typography>
                </Grid>
                <Grid item md={2} xs={2}>
                  <Typography fontWeight="600" fontSize="14px" textAlign="right">
                    Total
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {isMounted && cartList.length > 0 ? (
              cartList.map((item) => (
                <Box
                  key={item.id}
                  px="1rem"
                  py="1rem"
                  borderBottom="1px solid"
                  borderColor="gray.200">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item md={5} xs={5}>
                      <FlexBox alignItems="center">
                        <Box mr="1rem">
                          <LazyImage
                            alt={item.name}
                            src={item.imgUrl || "/assets/images/products/iphone-xi.png"}
                            width={60}
                            height={60}
                            borderRadius="5px"
                          />
                        </Box>
                        <Typography fontWeight="600" fontSize="14px">
                          {item.name}
                        </Typography>
                      </FlexBox>
                    </Grid>

                    <Grid item md={2} xs={2}>
                      <Typography fontSize="14px" textAlign="center">
                        {currency(item.price)}
                      </Typography>
                    </Grid>

                    <Grid item md={3} xs={3}>
                      <FlexBox alignItems="center" justifyContent="center">
                        <Button
                          size="none"
                          padding="4px"
                          color="primary"
                          variant="outlined"
                          disabled={item.qty === 1}
                          borderColor="gray.400"
                          onClick={handleCartAmountChange(item.qty - 1, item)}>
                          <Icon variant="small">minus</Icon>
                        </Button>

                        <Typography mx="0.75rem" fontWeight="600" fontSize="14px">
                          {item.qty}
                        </Typography>

                        <Button
                          size="none"
                          padding="4px"
                          color="primary"
                          variant="outlined"
                          borderColor="gray.400"
                          onClick={handleCartAmountChange(item.qty + 1, item)}>
                          <Icon variant="small">plus</Icon>
                        </Button>
                      </FlexBox>
                    </Grid>

                    <Grid item md={2} xs={2}>
                      <Typography fontSize="14px" fontWeight="600" textAlign="right">
                        {currency(item.price * item.qty)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))
            ) : isMounted ? (
              <Box py="2rem" textAlign="center">
                <Typography fontSize="16px" fontWeight="600" color="gray.600">
                  Cart is Empty
                </Typography>
              </Box>
            ) : null}

            <FlexBox p="2px" flexDirection={{ xs: "column", md: "row" }} style={{ gap: 2 }}>
              <Box width="100%">
                <Link href="/" passHref>
                  <Button
                    variant="outlined"
                    color="dark"
                    borderRadius="5px"
                    fullwidth
                    style={{ textTransform: "none" }}>
                    <Icon size="1rem" mr="0.5rem">
                      shopping-cart
                    </Icon>
                    Shop More
                  </Button>
                </Link>
              </Box>

              <Box width="100%">
                <Button
                  variant="contained"
                  color="primary"
                  borderRadius="5px"
                  fullwidth
                  style={{ textTransform: "none" }}
                  onClick={() => dispatch({ type: "CLEAR_CART" })}>
                  <Icon size="1rem" mr="0.5rem">
                    delete
                  </Icon>
                  Clear Cart
                </Button>
              </Box>
            </FlexBox>

            <Divider bg="gray.300" />

            <Box p="2px">
              <Box
                bg="gray.100"
                p="1px"
                borderRadius="5px"
                border="1px solid"
                borderColor="gray.300"
                maxWidth="100%">
                <TextField
                  placeholder="ENTER COUPON CODE"
                  fullwidth
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    padding: "10px 15px",
                    fontSize: "14px",
                    textTransform: "uppercase"
                  }}
                />
              </Box>

              <Typography mt="1rem" fontSize="13px" fontWeight="600">
                To get discount with our special coupone please register !!{" "}
                <Link href="/register">
                  <Typography
                    as="span"
                    color="marron.main"
                    style={{ textDecoration: "underline", cursor: "pointer" }}>
                    Register now &rarr;
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item lg={4} md={4} xs={12}>
          <Card1 borderRadius="8px" p="2px">
            <Typography fontSize="20px" fontWeight="700" mb="2px">
              Cart Summery
            </Typography>

            <FlexBox justifyContent="space-between" alignItems="center" mb="2px">
              <Typography color="gray.700" fontWeight="600">
                Order Total
              </Typography>
              <Typography fontWeight="600">{isMounted ? currency(getTotalPrice()) : currency(0)} Tk</Typography>
            </FlexBox>

            <Divider mb="2px" bg="gray.300" />

            <FlexBox justifyContent="space-between" alignItems="center" mb="2px">
              <Typography color="gray.700" fontWeight="600">
                Discount
              </Typography>
              <Typography fontWeight="600">0 Tk</Typography>
            </FlexBox>

            <Divider mb="2px" bg="gray.300" />

            <FlexBox justifyContent="space-between" alignItems="center" mb="2px">
              <Typography color="gray.700" fontWeight="600">
                Promotion Discount
              </Typography>
              <Typography fontWeight="600">0 Tk</Typography>
            </FlexBox>

            <Divider mb="2px" bg="gray.300" />

            <FlexBox justifyContent="space-between" alignItems="center" mb="2px" pt="2px">
              <Typography fontSize="16px" fontWeight="700">
                Final Total
              </Typography>
              <Typography fontSize="16px" fontWeight="700">
                {isMounted ? currency(getTotalPrice()) : currency(0)} Tk
              </Typography>
            </FlexBox>

            <Link href="/checkout" passHref>
              <Button
                variant="contained"
                color="primary"
                fullwidth
                borderRadius="5px"
                py="12px"
                style={{ textTransform: "none" }}>
                <Icon size="1.25rem" mr="10px">
                  credit-card
                </Icon>
                Proceed to Checkout
              </Button>
            </Link>
          </Card1>
        </Grid>
      </Grid>

      {/* Pookie Floating Sticker */}
      {
        isMounted && (
          <StyledSticker onClick={() => dispatch({ type: "TOGGLE_CART", payload: true })}>
            <FlexBox flexDirection="column" alignItems="center">
              <Box className="items-badge" borderRadius="50%" width="30px" height="30px" display="flex" alignItems="center" justifyContent="center" mb="6px">
                <Typography fontSize="12px">
                  {cartList.reduce((acc, item) => acc + item.qty, 0)}
                </Typography>
              </Box>

              <Icon size="1.75rem" mb="4px" className="cart-icon">shopping-bag</Icon>

              <Typography fontSize="9px" fontWeight="700" style={{ textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.9 }}>
                Cart
              </Typography>

              <Box mt="8px" pt="6px" borderTop="1px solid rgba(255,255,255,0.3)" width="100%" textAlign="center">
                <Typography fontSize="14px" fontWeight="800">
                  ৳{getTotalPrice()}
                </Typography>
              </Box>
            </FlexBox>
          </StyledSticker>
        )}
    </Container>
  );
}

const stateList = [
  { value: "New York", label: "New York" },
  { value: "Chicago", label: "Chicago" }
];

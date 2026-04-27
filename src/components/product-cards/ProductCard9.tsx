"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useState, useEffect } from "react";
import styled from "styled-components";

import Box from "../Box";
import Card from "../Card";
import Image from "../Image";
import { Chip } from "../Chip";
import Hidden from "../hidden";
import Rating from "../rating";
import Grid from "../grid/Grid";
import Icon from "../icon/Icon";
import FlexBox from "../FlexBox";
import NavLink from "../nav-link";
import { Button } from "../buttons";
import { H5, SemiSpan } from "../Typography";
import ProductQuickView from "@component/products/ProductQuickView";
import { useAppContext } from "@context/app-context";
import { calculateDiscount, currency, getTheme } from "@utils/utils";

// STYLED COMPONENT
const Wrapper = styled(Card)`
  border-radius: 0.5rem;
  .quick-view {
    top: 0.75rem;
    display: none;
    right: 0.75rem;
    cursor: pointer;
    position: absolute;
  }
  .categories {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .categories {
    display: flex;
    .link {
      font-size: 14px;
      margin-right: 0.5rem;
      text-decoration: underline;
      color: ${getTheme("colors.text.hint")};
    }
  }

  h4 {
    text-align: left;
    margin: 0.5rem 0px;
    color: ${getTheme("colors.text.secondary")};
  }

  .price {
    display: flex;
    font-weight: 600;
    margin-top: 0.5rem;

    h4 {
      margin: 0px;
      padding-right: 0.5rem;
      color: ${getTheme("colors.primary.main")};
    }
    del {
      color: ${getTheme("colors.text.hint")};
    }
  }

  .icon-holder {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    justify-content: space-between;
  }

  .favorite-icon {
    cursor: pointer;
  }
  .outlined-icon {
    svg path {
      fill: ${getTheme("colors.text.hint")};
    }
  }
  .add-cart {
    display: none;
  }

  &:hover {
    .add-cart {
      display: flex;
    }
    .quick-view {
      display: block;
    }
  }
`;

// ============================================================================
type ProductCard9Props = {
  off?: number;
  slug: string;
  title: string;
  price: number;
  regularPrice?: number;
  imgUrl: string;
  rating: number;
  images: string[];
  id: string | number;
  categories: string[];
  categorySlug?: string;
  [key: string]: unknown;
};
// ============================================================================

export default function ProductCard9({
  id,
  off,
  slug,
  title,
  price,
  regularPrice,
  imgUrl,
  rating,
  images,
  categories,
  categorySlug,
  ...props
}: ProductCard9Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useAppContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const cartItem = state.cart.find((item) => item.id === id);

  const toggleDialog = useCallback(() => setOpen((open) => !open), []);

  const handleCartAmountChange = (qty: number) => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { price, regularPrice, originalPrice: regularPrice || price, imgUrl, id, qty, slug, name: title }
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cartItem?.qty) handleCartAmountChange(1);
    router.push("/checkout");
  };

  const productPath = categorySlug ? `/pro/${slug}?cat=${categorySlug}` : `/pro/${slug}`;

  return (
    <Wrapper overflow="hidden" width="100%" {...props}>
      <Grid container spacing={1}>
        <Grid item md={3} sm={4} xs={12}>
          <Box position="relative">
            {!!off && (
              <Chip
                top="10px"
                left="10px"
                p="5px 10px"
                fontSize="10px"
                fontWeight="600"
                bg="primary.main"
                position="absolute"
                color="primary.text">
                {off}% off
              </Chip>
            )}

            <span onClick={toggleDialog}>
              <Icon color="secondary" variant="small" className="quick-view">
                eye-alt
              </Icon>
            </span>

            <Image src={imgUrl} alt={title} width="100%" borderRadius="0.5rem" />
          </Box>
        </Grid>

        <Grid item md={8} sm={8} xs={12}>
          <FlexBox flexDirection="column" justifyContent="center" height="100%" p="1rem">

            <Link href={productPath}>
              <H5 fontWeight="600" my="0.5rem">
                {title}
              </H5>
            </Link>

            <Rating value={rating || 3} outof={5} color="warn" />

            <FlexBox mt="0.5rem" mb="1rem" alignItems="center">
              <H5 fontWeight={600} color="primary.main" mr="0.5rem">
                {currency(price)}
              </H5>

              {off > 0 && (
                <SemiSpan fontWeight="600">
                  <del>{currency(regularPrice || price)}</del>
                </SemiSpan>
              )}
            </FlexBox>

            <Hidden up="sm">
              <FlexBox style={{ gap: 8 }} mt="10px">
                {isMounted && cartItem?.qty ? (
                  <FlexBox
                    alignItems="center"
                    justifyContent="space-between"
                    flex={1}
                    p="2px"
                    borderRadius="4px"
                    style={{ border: `1px solid ${getTheme("colors.gray.300")}`, height: 32 }}>
                    <Button variant="text" size="small" p="5px" onClick={() => handleCartAmountChange(cartItem.qty - 1)} style={{ minWidth: 24 }}>
                      <Icon size="10px">minus</Icon>
                    </Button>

                    <H5 fontWeight="600" fontSize="14px">{cartItem.qty}</H5>

                    <Button variant="text" size="small" p="5px" onClick={() => handleCartAmountChange(cartItem.qty + 1)} style={{ minWidth: 24 }}>
                      <Icon size="10px">plus</Icon>
                    </Button>
                  </FlexBox>
                ) : (
                  <Button
                    fullwidth
                    color="dark"
                    variant="outlined"
                    size="small"
                    onClick={() => handleCartAmountChange(1)}
                    style={{ fontSize: 10, padding: "5px 0", height: 32 }}>
                    Add Cart
                  </Button>
                )}

                <Button
                  fullwidth
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={handleBuyNow}
                  style={{ fontSize: 10, padding: "5px 0", height: 32 }}>
                  Buy Now
                </Button>
              </FlexBox>
            </Hidden>
          </FlexBox>
        </Grid>

        <Hidden as={Grid} down="sm" item flex={1} md={3} xs={12}>
          <FlexBox
            ml="auto"
            height="100%"
            alignItems="center"
            flexDirection="column"
            justifyContent="center">

            <FlexBox style={{ gap: 8, width: '100%' }}>
              {isMounted && cartItem?.qty ? (
                <FlexBox
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  p="2px"
                  borderRadius="4px"
                  style={{ border: `1px solid ${getTheme("colors.gray.300")}`, height: 36 }}>
                  <Button variant="text" size="small" p="5px" onClick={() => handleCartAmountChange(cartItem.qty - 1)}>
                    <Icon size="10px">minus</Icon>
                  </Button>

                  <H5 fontWeight="600" fontSize="14px">{cartItem.qty}</H5>

                  <Button variant="text" size="small" p="5px" onClick={() => handleCartAmountChange(cartItem.qty + 1)}>
                    <Icon size="10px">plus</Icon>
                  </Button>
                </FlexBox>
              ) : (
                <Button
                  fullwidth
                  color="dark"
                  variant="outlined"
                  size="small"
                  onClick={() => handleCartAmountChange(1)}
                  style={{ height: 36 }}>
                  Add To Cart
                </Button>
              )}


              <Button
                fullwidth
                color="primary"
                variant="contained"
                size="small"
                onClick={handleBuyNow}
                style={{ height: 36 }}>
                Buy Now
              </Button>
            </FlexBox>

          </FlexBox>
        </Hidden>
      </Grid>

      <ProductQuickView
        open={open}
        onClose={toggleDialog}
        product={{ id, images, price, regularPrice, title, slug }}
      />
    </Wrapper >
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";

import { useAppContext } from "@context/app-context";

import Box from "@component/Box";
import Rating from "@component/rating";
import { Chip } from "@component/Chip";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button, IconButton } from "@component/buttons";
import NextImage from "@component/NextImage";
import Card, { CardProps } from "@component/Card";
import { H3, SemiSpan } from "@component/Typography";
import ProductQuickView from "@component/products/ProductQuickView";

import { IoCartOutline, IoBagCheckOutline } from "react-icons/io5";
import { calculateDiscount, currency, getTheme } from "@utils/utils";
import { deviceSize } from "@utils/constants";

// STYLED COMPONENT
const Wrapper = styled(Card)`
  margin: auto;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: space-between;
  transition: all 250ms ease-in-out;

  &:hover {
    .details {
      .add-cart {
        display: flex;
      }
    }
    .image-holder {
      .extra-icons {
        display: flex;
      }
    }
  }

  .image-holder {
    text-align: center;
    position: relative;
    display: inline-block;
    height: 100%;

    .extra-icons {
      z-index: 2;
      top: 0.75rem;
      display: none;
      right: 0.75rem;
      cursor: pointer;
      position: absolute;
      flex-direction: column;
      gap: 0.25rem;
    }

    @media only screen and (max-width: ${deviceSize.sm}px) {
      display: block;
    }
  }

  .details {
    padding: 1rem;

    .title,
    .categories {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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
      margin-top: auto;
      align-items: center;
      flex-direction: column;
    }
  }

  @media only screen and (max-width: 768px) {
    .details {
      .add-cart {
        display: flex;
      }
    }
  }
`;

// =======================================================================
interface ProductCard1Props extends CardProps {
  off?: number;
  slug: string;
  title: string;
  price: number;
  regularPrice?: number;
  imgUrl: string;
  rating: number;
  images: string[];
  id?: string | number;
  categorySlug?: string;
  showActionButtons?: boolean;
}
// =======================================================================

export default function ProductCard1({
  id,
  off,
  slug,
  title,
  price,
  regularPrice,
  imgUrl,
  images,
  rating = 4,
  categorySlug,
  showActionButtons,
  ...props
}: ProductCard1Props) {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { state, dispatch } = useAppContext();
  const theme = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItem = state.cart.find((item) => item.id === id);
  const productPath = categorySlug ? `/pro/${slug}?cat=${categorySlug}` : `/pro/${slug}`;

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  const handleCartAmountChange = (amount: number) => () => {
    // const discountedPrice = off ? price - (price * off) / 100 : price;

    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: {
        id: id as number | string,
        slug,
        price: price, // Price is now already discounted if applicable
        originalPrice: regularPrice || price,
        discount: off,
        imgUrl,
        name: title,
        qty: amount
      }
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    // const discountedPrice = off ? price - (price * off) / 100 : price;

    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: {
        id: id as number | string,
        slug,
        price: price, // Price is now already discounted if applicable
        originalPrice: regularPrice || price,
        discount: off,
        imgUrl,
        name: title,
        qty: (cartItem?.qty || 0) + 1
      }
    });
    router.push("/checkout");
  };

  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }

    // Debugging navigation failure
    // If slug is missing, it should be handled by the fallback in parent, but double check
    if ((!slug || !productPath || productPath === '/product/') && !id) {
      // Silent fail or minimal log if absolutely necessary, but removing verbose logs as requested
      return;
    }

    router.push(productPath);
  };

  return (
    <>
      <Wrapper borderRadius={8} {...props} onClick={handleCardClick} cursor="pointer">
        <div className="image-holder">
          {!!off && (
            <Chip
              top="10px"
              left="10px"
              p="5px 10px"
              fontSize="10px"
              fontWeight="600"
              bg="primary.main"
              position="absolute"
              color="primary.text"
              zIndex={1}>
              {off}% off
            </Chip>
          )}

          <FlexBox className="extra-icons">
            <IconButton size="small" padding="0.5rem" onClick={toggleDialog}>
              <Icon color="secondary" variant="small">
                eye-alt
              </Icon>
            </IconButton>

            <IconButton size="small" padding="0.5rem">
              <Icon className="favorite-icon outlined-icon" variant="small">
                heart
              </Icon>
            </IconButton>
          </FlexBox>

          <Link href={productPath}>
            <NextImage alt={title} width={277} src={imgUrl} height={270} />
          </Link>
        </div>

        <div className="details">
          <FlexBox>
            <Box flex="1 1 0" minWidth="0px" mr="0.5rem">
              <Link href={productPath}>
                <H3
                  mb="10px"
                  title={title}
                  fontSize="14px"
                  textAlign="left"
                  fontWeight="600"
                  className="title"
                  color="text.secondary">
                  {title}
                </H3>
              </Link>

              <Rating value={rating || 0} outof={5} color="warn" readOnly />

              <FlexBox alignItems="center" mt="10px">
                <SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
                  {currency(price)}
                </SemiSpan>

                {!!off && (
                  <SemiSpan color="text.muted" fontWeight="600">
                    <del>{currency(regularPrice || price)}</del>
                  </SemiSpan>
                )}
              </FlexBox>
            </Box>
          </FlexBox>

          {/* Buttons moved to details section below */}

          <FlexBox mt="10px" style={{ gap: 8 }}>
            {isMounted && cartItem?.qty ? (
              <FlexBox
                alignItems="center"
                justifyContent="space-between"
                flex={1}
                p="2px"
                borderRadius="4px"
                style={{
                  border: `1px solid ${theme && theme.colors && theme.colors.gray ? theme.colors.gray[300] : "#DAE1E7"
                    }`,
                  height: 32
                }}>
                <Button
                  variant="text"
                  size="small"
                  p="5px"
                  onClick={handleCartAmountChange(cartItem.qty - 1)}>
                  <Icon size="10px">minus</Icon>
                </Button>

                <SemiSpan fontWeight="600" fontSize={11}>{cartItem.qty}</SemiSpan>

                <Button
                  variant="text"
                  size="small"
                  p="5px"
                  onClick={handleCartAmountChange(cartItem.qty + 1)}>
                  <Icon size="10px">plus</Icon>
                </Button>
              </FlexBox>
            ) : (
              <Button
                fullwidth
                color="dark"
                variant="outlined"
                size="small"
                onClick={handleCartAmountChange(1)}
                style={{ fontSize: 10, padding: "5px 0", height: 32, textTransform: "none" }}>
                Add Cart
              </Button>
            )}

            <Button
              fullwidth
              color="primary"
              variant="contained"
              size="small"
              onClick={handleBuyNow}
              style={{ fontSize: 10, padding: "5px 0", height: 32, textTransform: "none" }}>
              Buy Now
            </Button>
          </FlexBox>

        </div>
      </Wrapper >

      <ProductQuickView
        open={open}
        onClose={toggleDialog}
        product={{ images, title, price, id: id as number | string, slug }}
      />
    </>
  );
}

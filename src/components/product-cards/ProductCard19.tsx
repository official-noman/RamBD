"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, Fragment, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

import Box from "@component/Box";
import Rating from "@component/rating";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import NextImage from "@component/NextImage";
import { IconButton } from "@component/buttons";
import { H4, Paragraph, Small } from "@component/Typography";
import ProductQuickView from "@component/products/ProductQuickView";
import { useAppContext } from "@context/app-context";
import { currency } from "@utils/utils";
import { theme } from "@utils/theme";

// pulse animation
const pulse = keyframes`
  0% { background-color: ${theme.colors.gray[100]}; }
  50% { background-color: ${theme.colors.gray[200]}; }
  100% { background-color: ${theme.colors.gray[100]}; }
`;

const CardBox = styled(Box)`
  border-radius: 3px;
  transition: all 0.3s;
  background-color: white;
  border: 1px solid ${theme.colors.gray[100]};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    border: 1px solid #000;
    & .product-actions {
      right: 5px;
    }
    & .product-img {
      transform: scale(1.1);
    }
  }
`;

const CardMedia = styled(Box) <{ $loading?: boolean }>`
  width: 100%;
  height: 200px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => (props.$loading ? theme.colors.gray[100] : "transparent")};
  ${props =>
    props.$loading &&
    css`
      animation: ${pulse} 1.5s infinite ease-in-out;
    `}
  & .product-img {
    transition: opacity 0.4s ease-in-out;
    object-fit: contain;
  }
`;

import { Chip } from "@component/Chip";

const EyeButton = styled(IconButton)`
  top: 5px;
  right: -40px;
  position: absolute;
  transition: right 0.3s 0.1s;
  background: transparent;
`;

const FavoriteButton = styled(IconButton)`
  top: 35px;
  right: -40px;
  position: absolute;
  background: transparent;
  transition: right 0.3s 0.2s;
`;

// ==============================================================
type ProductCard19Props = {
  img: string;
  name: string;
  slug: string;
  price: number;
  regularPrice?: number;
  off?: number;
  reviews: number;
  images: string[];
  id: string | number;
  categorySlug?: string;
};
// ==============================================================

export default function ProductCard19(props: ProductCard19Props) {
  const { img, name, price, regularPrice, reviews, id, slug, images, categorySlug, off = 0 } = props;

  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItem = state.cart.find((item) => item.slug === slug);
  const productPath = categorySlug ? `/pro/${slug}?cat=${categorySlug}` : `/pro/${slug}`;

  // handle favorite
  const handleFavorite = () => setIsFavorite((fav) => !fav);

  //   handle modal
  const toggleDialog = () => setOpenDialog((state) => !state);

  // handle add to cart
  const handleAddToCart = () => {
    const payload = {
      id,
      slug,
      name,
      price,
      originalPrice: regularPrice || price,
      imgUrl: img,
      qty: (cartItem?.qty || 0) + 1
    };

    dispatch({ type: "CHANGE_CART_AMOUNT", payload });
  };

  const handleDecreaseQty = () => {
    const payload = {
      id,
      slug,
      name,
      price,
      originalPrice: regularPrice || price,
      imgUrl: img,
      qty: (cartItem?.qty || 0) - 1
    };

    dispatch({ type: "CHANGE_CART_AMOUNT", payload });
  };

  const handleBuyNow = () => {
    if (!cartItem?.qty) handleAddToCart();
    router.push("/checkout");
  };

  return (
    <Fragment>
      <CardBox height="100%">
        <CardMedia $loading={!isLoaded}>
          <Link href={productPath}>
            {!!off && (
              <Chip
                zIndex={1}
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
            <NextImage
              src={img}
              width={300}
              height={300}
              alt={name}
              className="product-img"
              sizes="(max-width: 640px) 50vw, 300px"
              onLoad={() => setIsLoaded(true)}
              style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.4s ease-in-out" }}
            />
          </Link>

          <EyeButton className="product-actions" onClick={() => setOpenDialog(true)}>
            <Icon size="18px">eye</Icon>
          </EyeButton>

        </CardMedia>

        <Box p={1.5} textAlign="center" flexGrow={1} display="flex" flexDirection="column" justifyContent="space-between">
          <Paragraph fontSize={13} mb={0.5} color="text.secondary" ellipsis={false} style={{ height: 40, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {name}
          </Paragraph>

          <H4 fontWeight={700} py=".25rem" fontSize={15} color="primary.main">
            {currency(price)}
            {regularPrice && regularPrice > price && (
              <del style={{ color: "grey", fontSize: "12px", marginLeft: "5px" }}>{currency(regularPrice)}</del>
            )}
          </H4>

          <FlexBox justifyContent="center" alignItems="center" mb="0.75rem">
            <Rating value={4} color="warn" size="small" />
            <Small fontWeight={600} color="gray.500" ml=".3rem" fontSize={11}>
              ({reviews})
            </Small>
          </FlexBox>

          <FlexBox style={{ gap: 8 }}>
            {isMounted && cartItem?.qty ? (
              <FlexBox
                alignItems="center"
                justifyContent="space-between"
                flex={1}
                p="2px"
                borderRadius="4px"
                style={{ border: `1px solid ${theme.colors.gray[300]}`, height: 32 }}>
                <Button variant="text" size="small" p="5px" onClick={handleDecreaseQty}>
                  <Icon size="10px">minus</Icon>
                </Button>

                <Small fontWeight="600">{cartItem.qty}</Small>

                <Button variant="text" size="small" p="5px" onClick={handleAddToCart}>
                  <Icon size="10px">plus</Icon>
                </Button>
              </FlexBox>
            ) : (
              <Button
                fullwidth
                color="dark"
                variant="outlined"
                size="small"
                onClick={handleAddToCart}
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
        </Box>
      </CardBox>

      {/* QUICK VIEW MODAL */}
      <ProductQuickView
        open={openDialog}
        onClose={toggleDialog}
        product={{ id, images, price, regularPrice, slug, title: name }}
      />
    </Fragment>
  );
}

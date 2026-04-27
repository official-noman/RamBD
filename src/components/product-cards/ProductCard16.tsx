"use client";

import Link from "next/link";
import { Fragment, useCallback, useState, useEffect } from "react";
import styled from "styled-components";

import Box from "@component/Box";
import Card from "@component/Card";
import { Chip } from "@component/Chip";
import Rating from "@component/rating";
import Icon from "@component/icon/Icon";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import LazyImage from "@component/LazyImage";
import { H3, Paragraph, Span } from "@component/Typography";
import ProductQuickView from "@component/products/ProductQuickView";
import { useAppContext } from "@context/app-context";
import { calculateDiscount, currency } from "@utils/utils";

// STYLED COMPONENTS
const StyledBazaarCard = styled(Card)(({ theme }) => ({
  margin: "auto",
  height: "100%",
  display: "flex",
  overflow: "hidden",
  position: "relative",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 250ms ease-in-out",
  borderRadius: "0px 10px 10px 10px",
  "&:hover": {
    boxShadow: theme && theme.shadows ? theme.shadows[2] : "none",
    "& .controller": { right: 10 }
  }
}));

const ImageWrapper = styled(Box)({
  textAlign: "center",
  position: "relative",
  display: "inline-block"
});

const ImageBox = styled(Box)(({ theme }) => ({
  padding: "44px 40px",
  borderBottom: `1px solid ${theme && theme.colors && theme.colors.gray ? theme.colors.gray[300] : "#DAE1E7"
    }`
}));

const HoverWrapper = styled(FlexBox)(({ theme }) => ({
  top: 0,
  bottom: 0,
  width: 34,
  right: -30,
  height: 120,
  margin: "auto",
  overflow: "hidden",
  borderRadius: "5px",
  background: "#fff",
  alignItems: "center",
  position: "absolute",
  flexDirection: "column",
  boxShadow: theme && theme.shadows ? theme.shadows[2] : "none",
  justifyContent: "space-between",
  transition: "right 0.3s ease-in-out",
  "& svg": {
    fontSize: 18,
    color: theme && theme.colors && theme.colors.gray ? theme.colors.gray[600] : "#7D879C"
  },
  "& span": {
    width: "100%",
    height: "100%",
    display: "flex",
    padding: "10px 0px",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": { cursor: "pointer", background: "#f3f5f9" }
  },
  "& a": {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": { cursor: "pointer", background: "#f3f5f9" }
  }
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  zIndex: 11,
  top: "16px",
  left: "0px",
  color: "white",
  fontWeight: 600,
  fontSize: "11px",
  padding: "3px 12px",
  position: "absolute",
  borderRadius: "0px 50px 50px 0px",
  background: theme && theme.colors && theme.colors.primary ? theme.colors.primary.main : "#D23F57"
}));

const ContentWrapper = styled(Box)({
  padding: "1rem",
  "& .title, & .categories": {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  }
});

const ButtonBox = styled(FlexBox)(({ theme }) => ({
  gap: 10,
  marginTop: "15px",
  justifyContent: "space-between",
  "& button": {
    color: "#fff",
    background: theme && theme.colors && theme.colors.primary ? theme.colors.primary.main : "#D23F57",
    "&:hover": {
      background:
        theme && theme.colors && theme.colors.primary ? theme.colors.primary[400] : "#E3364E"
    }
  },
  "& button svg path": { fill: "white !important" }
}));

// =============================================================
type ProductCardProps = {
  off: number;
  slug: string;
  title: string;
  price: number;
  regularPrice?: number;
  imgUrl: string;
  rating?: number;
  images: string[];
  id: string | number;
  hoverEffect?: boolean;
};
// =============================================================

export default function ProductCard16(props: ProductCardProps) {
  const { off, id, title, price, regularPrice, imgUrl, rating, hoverEffect, slug, images } = props;

  const { state, dispatch } = useAppContext();
  const [openModal, setOpenModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItem = state.cart.find((item) => item.id === id);

  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);

  const handleCartAmountChange = (qty: number) => () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { price, regularPrice, originalPrice: regularPrice || price, imgUrl, id, qty, slug, name: title }
    });
  };

  return (
    <StyledBazaarCard hoverEffect={hoverEffect}>
      <ImageWrapper>
        {off !== 0 && <StyledChip color="primary">{`${off}% off`}</StyledChip>}

        <ImageBox>
          <Link href={`/pro/${slug}`}>
            <LazyImage
              alt={title}
              src={imgUrl}
              width={190}
              height={190}
              loading="lazy"
              sizes="(max-width: 640px) 50vw, 190px"
              style={{ objectFit: "contain" }}
            />
          </Link>

          <HoverWrapper className="controller">
            <Span onClick={toggleDialog}>
              <Icon variant="small">eye-alt</Icon>
            </Span>

            <Divider />

            <Span>
              <Icon variant="small">heart</Icon>
            </Span>

            <Divider />

            <Span onClick={handleCartAmountChange(1)}>
              <Icon variant="small">shopping-cart</Icon>
            </Span>
          </HoverWrapper>
        </ImageBox>
      </ImageWrapper>

      <ProductQuickView
        open={openModal}
        onClose={toggleDialog}
        product={{ id, images, slug, price, regularPrice, title }}
      />

      <ContentWrapper>
        <Box flex="1 1 0" minWidth="0px" mr={1}>
          <Link href={`/pro/${slug}`}>
            <H3
              mb={1}
              title={title}
              fontSize="14px"
              fontWeight="600"
              className="title"
              color="text.secondary">
              {title}
            </H3>
          </Link>

          {rating && (
            <FlexBox alignItems="center">
              <Rating value={rating || 0} color="warn" />
              <Paragraph ml={2}>{`(${rating}.0)`}</Paragraph>
            </FlexBox>
          )}

          <FlexBox alignItems="center" mt={1}>
            <Box fontWeight="600" color="primary.main" mr={1}>
              {currency(price)}
            </Box>

            {off !== 0 && (
              <Box color="grey.600" fontWeight="600">
                <del>{currency(regularPrice || price)}</del>
              </Box>
            )}
          </FlexBox>
        </Box>

        <ButtonBox>
          <Button
            variant="contained"
            onClick={handleCartAmountChange(isMounted && cartItem?.qty ? cartItem.qty - 1 : 1)}
            style={{
              paddingTop: "3px",
              paddingBottom: "3px",
              width: "100%",
              fontSize: "13px"
            }}>
            {isMounted && cartItem?.qty ? (
              <Fragment>
                <Icon size="16px">minus</Icon> Remove from Cart
              </Fragment>
            ) : (
              <Fragment>
                <Icon size="16px">plus</Icon> Add to Cart
              </Fragment>
            )}
          </Button>

          <Button variant="contained" style={{ padding: "4px 12px" }}>
            <Icon size="16px">heart</Icon>
          </Button>
        </ButtonBox>
      </ContentWrapper>
    </StyledBazaarCard>
  );
}

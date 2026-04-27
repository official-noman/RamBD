"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import styled from "styled-components";

import Rating from "@component/rating";
import { Chip } from "@component/Chip";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import LazyImage from "@component/LazyImage";
import { H3, Paragraph, Span } from "@component/Typography";
import ProductQuickView from "@component/products/ProductQuickView";

import { theme } from "@utils/theme";
import { calculateDiscount, currency } from "@utils/utils";
import { useAppContext } from "@context/app-context";

// STYLED COMPONENTS
const StyledCard = styled("div")({
  height: "100%",
  margin: "auto",
  borderRadius: 0,
  overflow: "hidden",
  position: "relative",
  transition: "all 250ms ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[6],
    "& .controlBox": { display: "flex", bottom: 0 }
  }
});

const ImgBox = styled("div")(({ theme }) => ({
  height: "200px",
  overflow: "hidden",
  position: "relative",
  padding: "0 40px 20px 40px",
  background: theme.colors.marron[100],
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}));

const ItemController = styled("div")(({ theme }) => ({
  width: 35,
  right: 15,
  height: 120,
  bottom: -120,
  display: "flex",
  overflow: "hidden",
  background: "#fff",
  position: "absolute",
  flexDirection: "column",
  transition: "bottom 0.3s ease-in-out",
  "& svg": { fontSize: 18, color: theme.colors.gray[600] },
  "& span": {
    width: "100%",
    height: "100%",
    display: "flex",
    padding: "8px 10px",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      cursor: "pointer",
      background: theme.colors.marron.main,
      "& svg": { color: "#fff" }
    }
  }
}));

const ContentWrapper = styled("div")({
  padding: "1rem",
  "& .title, & .categories": {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  }
});

const StyledChip = styled(Chip)(({ theme }) => ({
  zIndex: 11,
  top: "16px",
  left: "0px",
  color: "white",
  borderRadius: 0,
  fontWeight: 600,
  fontSize: "10px",
  padding: "3px 7px",
  position: "absolute",
  background: theme.colors.marron.main
}));

// ============================================================
type Props = {
  off: number;
  slug: string;
  title: string;
  price: number;
  regularPrice?: number;
  imgUrl: string;
  rating?: number;
  images: string[];
  id: string | number;
};
// ============================================================

export default function ProductCard15(props: Props) {
  const { off, id, title, price, regularPrice, imgUrl, rating, slug, images } = props;

  const [open, setOpen] = useState(false);
  const { state, dispatch } = useAppContext();

  const cartItem = state.cart.find((item) => item.slug === slug);

  const toggleDialog = useCallback(() => setOpen((open) => !open), []);

  // handle add to cart
  const handleAddToCart = () => {
    const payload = {
      id,
      slug,
      price,
      regularPrice,
      imgUrl,
      name: title,
      qty: (cartItem?.qty || 0) + 1
    };

    dispatch({ type: "CHANGE_CART_AMOUNT", payload });
  };

  return (
    <StyledCard>
      <ImgBox id="imgBox">
        {off !== 0 && <StyledChip color="primary">{off}% off</StyledChip>}

        <Link href={`/pro/${slug}`}>
          <LazyImage
            src={imgUrl}
            width={200}
            height={200}
            alt={title}
            loading="lazy"
            sizes="(max-width: 640px) 50vw, 200px"
            style={{ height: "auto", width: "100%", objectFit: "contain" }}
          />
        </Link>

        <ItemController className="controlBox">
          <Span onClick={toggleDialog}>
            <Icon variant="small">eye-alt</Icon>
          </Span>

          <Span>
            <Icon variant="small">heart</Icon>
          </Span>

          <Span onClick={handleAddToCart}>
            <Icon variant="small">shopping-cart</Icon>
          </Span>
        </ItemController>
      </ImgBox>

      <ProductQuickView
        open={open}
        onClose={toggleDialog}
        product={{ id, slug, images, price, regularPrice, title }}
      />

      <ContentWrapper>
        <FlexBox justifyContent="center">
          <Paragraph pr={2} fontWeight="600" color="marron.main">
            {currency(price)}
          </Paragraph>

          {off !== 0 && (
            <Paragraph color="gray.600" fontWeight="600">
              <del>{currency(regularPrice || price)}</del>
            </Paragraph>
          )}
        </FlexBox>

        <Link href={`/pro/${slug}`}>
          <H3
            my=".5rem"
            title={title}
            fontSize="15px"
            fontWeight="600"
            className="title"
            textAlign="center"
            color="text.secondary">
            {title}
          </H3>
        </Link>

        {rating && (
          <FlexBox alignItems="center" justifyContent="center">
            <Rating value={rating || 0} color="warn" />{" "}
            <Paragraph
              ml={2}
              lineHeight={1}
              color={theme.colors.gray[600]}>{`(${rating}.0)`}</Paragraph>
          </FlexBox>
        )}
      </ContentWrapper>
    </StyledCard>
  );
}

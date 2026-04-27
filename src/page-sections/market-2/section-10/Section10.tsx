"use client";

import Link from "next/link";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Container from "@component/Container";
import { H2, Span, Paragraph } from "@component/Typography";
import { ProductCard19 } from "@component/product-cards";
import Product from "@models/product.model";

// ======================================================================
type Section10Props = { products: Product[] };
// ======================================================================

export default function Section10({ products }: Section10Props) {
  return (
    <Container mb="0px">
      <FlexBox alignItems="center" justifyContent="space-between" flexWrap="wrap" mb="1.5rem">
        <div>
          <H2 fontSize={20}>Most Popular Products</H2>
          <Paragraph>All our new arrivals in a exclusive brand selection</Paragraph>
        </div>

        <Link href="/most-popular">
          <FlexBox alignItems="center" color="success.main" style={{ gap: 4, cursor: "pointer" }}>
            <Span fontWeight="600" fontSize={13}>View All</Span>
            <Icon size="12px">right-arrow</Icon>
          </FlexBox>
        </Link>
      </FlexBox>

      <Grid container spacing={1}>
        {products.slice(0, 5).map((product) => (
          <Grid item xl={2.4} lg={2.4} md={3} sm={4} xs={6} key={product.id}>
            <Box py="5px">
              <ProductCard19
                id={product.id}
                slug={product.slug}
                name={product.title}
                price={product.price}
                off={product.discount}
                regularPrice={product.regularPrice}
                img={product.thumbnail}
                images={product.images as string[]}
                reviews={product.reviews?.length || 15}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

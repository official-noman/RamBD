"use client";

import Link from "next/link";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { H2, Span } from "@component/Typography";
import Container from "@component/Container";
import { ProductCard19 } from "@component/product-cards";
import Product from "@models/product.model";

// =========================================================
type Props = { products: Product[] };
// =========================================================

export default function Section11({ products }: Props) {
    return (
        <Container pt="0px" id="latest-products">
            <FlexBox alignItems="center" justifyContent="space-between" mb="5px">
                <H2 fontSize={20}>Our Latest Product</H2>

                <Link href="/latest-products">
                    <FlexBox alignItems="center" color="success.main" style={{ gap: 4, cursor: "pointer" }}>
                        <Span fontWeight="600" fontSize={13}>View All</Span>
                        <Icon size="12px">right-arrow</Icon>
                    </FlexBox>
                </Link>
            </FlexBox>

            <Grid container spacing={1}>
                {products?.slice(0, 15).map((product) => (
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
                                reviews={product.reviews?.length || 10}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

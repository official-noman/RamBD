import { Fragment, Suspense } from "react";
import { Metadata } from "next";
import api from "@utils/__api__/products";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import Container from "@component/Container";
import ProductIntro from "@component/products/ProductIntro";
import { H3, Paragraph } from "@component/Typography";
import LatestProductsSidebar from "@component/products/LatestProductsSidebar";
import ProductViewWrapper from "@component/products/ProductViewWrapper";

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { cat } = await searchParams;
    const product = await api.getProduct(slug, cat);

    if (!product) {
        return {
            title: "Product Not Found | RamBD",
            description: "The product you are looking for does not exist."
        };
    }

    const metaTitle = product.meta_title || `${product.title} | RamBD`;
    const metaDescription = product.pro_meta_description || (product.description
        ? product.description.replace(/<[^>]*>/g, '').slice(0, 160) + "..."
        : `Buy ${product.title} at the best price from RamBD.`);
    
    // Support both direct meta keys and special_keywords from search API
    const metaKeywords = product.pro_meta_key || product.special_keywords || "";

    const storageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL || "https://admin.unicodeconverter.info/storage/app/public/products";  
    const ogImages = (product.images && product.images.length > 0)
        ? product.images.slice(0, 3).map((imgUrl: string) => {
            const fullUrl = imgUrl.startsWith("http") ? imgUrl : `${storageBaseUrl}/${imgUrl}`;
            return { url: fullUrl, width: 1200, height: 630, type: "image/png" };
        })
        : [{ url: `${process.env.NEXT_PUBLIC_APP_URL || "https://felna-tech.com"}/assets/images/rambd_logo.webp`, width: 400, height: 400 }];

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: metaKeywords,
        openGraph: {
            title: product.title,
            description: metaDescription,
            images: ogImages,
            type: "website",
        },
    };
}

// ==============================================================
type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ cat?: string }>;
};
// ==============================================================

import RelatedProductsWrapper from "@component/products/RelatedProductsWrapper";

export default async function ProductDetails({ params, searchParams }: Props) {
    const { slug } = await params;
    const { cat } = await searchParams;

    const product = await api.getProduct(slug, cat);

    if (!product) {
        return (
            <Container mb="2rem" mt="2rem">
                <Box textAlign="center" py="5rem">
                    <H3>Product Not Found</H3>
                    <Paragraph>The product you are looking for might have been moved or deleted.</Paragraph>
                </Box>
            </Container>
        );
    }

    const effectiveCat = cat || (product.categories && product.categories.length > 0 ? product.categories[0] : undefined);

    return (
        <Fragment>
            <Container mb="1rem" mt="10px" p="0">
                <Box overflow="hidden" p="0">
                    <FlexBox flexWrap="wrap" alignItems="stretch" style={{ gap: 2 }}>
                        {/* LEFT COLUMN: INTRO + TABS */}
                        <Box flex="1 1 0" minWidth={300} display="flex" flexDirection="column" style={{ gap: 2 }}>
                            <ProductIntro
                                {...product}
                                slug={slug}
                            />

                            <Box flex="1" display="flex" flexDirection="column">
                                <Suspense fallback={<Box bg="white" p="2rem" borderRadius={8} shadow={1} textAlign="center" flex="1">Loading details...</Box>}>
                                    <ProductViewWrapper product={product} />
                                </Suspense>
                            </Box>
                        </Box>

                        {/* RIGHT COLUMN: SIDEBAR */}
                        <Box width="220px">
                            <Suspense fallback={<Box width="220px" bg="white" p="8px" borderRadius={8} height="100%" shadow={1} />}>
                                <LatestProductsSidebar />
                            </Suspense>
                        </Box>
                    </FlexBox>
                </Box>
            </Container>

            <Container mb="1rem" p="0">
                <Suspense fallback={<Box p="2rem" textAlign="center">Loading related products...</Box>}>
                    <RelatedProductsWrapper effectiveCat={effectiveCat} parentId={product.parentId} />
                </Suspense>
            </Container>
        </Fragment>
    );
}

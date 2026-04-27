"use client";

import styled from "styled-components";
import { useCallback, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import Box from "@component/Box";
import Card from "@component/Card";
import Select from "@component/Select";
import Icon from "@component/icon/Icon";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import { H5, Paragraph } from "@component/Typography";

import ProductGridView from "@component/products/ProductCard19List";
import ProductListView from "@component/products/ProductCard9List";
import ProductFilterCard from "@component/products/ProductFilterCard";
import useWindowSize from "@hook/useWindowSize";
import Product from "@models/product.model";

// ==============================================================
type Props = {
    sortOptions: { label: string; value: string }[];
    products: Product[];
    categoryName?: string;
    categoryDescription?: string | null;
    totalPages: number;
    totalProducts: number;
    currentPage: number;
    minPriceDefault?: number;
    maxPriceDefault?: number;
    categories: any[];
    brands: { id: string; name: string }[];
};
// ==============================================================

const ArticleWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 17px;

  h1, .fallback-title {
    font-size: 36px;
    margin-bottom: 2rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #d23f57;
    text-transform: capitalize;
    text-align: center;
    line-height: 1.2;
  }

  h2 {
    font-size: 26px;
    margin-top: 2.5rem;
    margin-bottom: 1.5rem;
    font-weight: 700;
    border-bottom: 2px solid rgba(210, 63, 87, 0.1);
    padding-bottom: 0.5rem;
    display: inline-block;
  }

  h3 {
    font-size: 22px;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.gray[700]};
    text-align: justify;
    margin-left: auto;
    margin-right: auto;
  }

  ul, ol {
    margin-left: 2.5rem;
    margin-bottom: 2rem;
    margin-left: auto;
    margin-right: auto;
  }

  li {
    margin-bottom: 0.75rem;
    color: ${({ theme }) => theme.colors.gray[700]};
  }

  strong {
    color: ${({ theme }) => theme.colors.gray[900]};
    font-weight: 700;
  }

  a {
    color: #d23f57 !important;
    text-decoration: underline !important;
    text-underline-offset: 4px;
    text-decoration-thickness: 2px;
    text-decoration-color: rgba(210, 63, 87, 0.3);
    font-weight: 700 !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
      color: #e3364e !important;
      text-decoration-color: #d23f57;
      background-color: rgba(210, 63, 87, 0.05);
      border-radius: 4px;
      padding-left: 4px;
      padding-right: 4px;
      margin-left: -4px;
      margin-right: -4px;
    }
  }
`;

export default function CategorySearchResult({
    sortOptions,
    products: initialProducts,
    categoryName,
    categoryDescription,
    totalPages,
    totalProducts,
    currentPage,
    minPriceDefault,
    maxPriceDefault,
    categories,
    brands
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const width = useWindowSize();

    const [view, setView] = useState<"grid" | "list">("grid");
    const [products, setProducts] = useState(initialProducts);

    const currentSortValue = searchParams.get("sort") || sortOptions[0].value;
    const currentSort = useMemo(() =>
        sortOptions.find(opt => opt.value === currentSortValue) || sortOptions[0]
        , [sortOptions, currentSortValue]);

    const isTablet = width < 1025;
    const toggleView = useCallback((v: any) => () => setView(v), []);

    const handleSortChange = (option: any) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", option.value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        let filtered = [...initialProducts];

        // 1. Filter by Brand (Only if not already filtered by API, but we apply for consistency)
        const brandIds = searchParams.get("brand_id")?.split(",") || [];
        if (brandIds.length > 0) {
            filtered = filtered.filter(p => p.brandId && brandIds.includes(String(p.brandId)));
        }

        // 2. Filter by Price
        const minPrice = Number(searchParams.get("min_price"));
        const maxPrice = Number(searchParams.get("max_price"));
        if (minPrice) filtered = filtered.filter(p => p.price >= minPrice);
        if (maxPrice) filtered = filtered.filter(p => p.price <= maxPrice);

        // 3. Filter by Ratings
        const ratings = searchParams.get("ratings")?.split(",") || [];
        if (ratings.length > 0) {
            filtered = filtered.filter(p => ratings.includes(Math.round(p.rating || 5).toString()));
        }

        // 4. Filter by Availability
        const onSale = searchParams.get("on_sale") === "true";
        const inStock = searchParams.get("in_stock") === "true";
        const featured = searchParams.get("featured") === "true";

        if (onSale) filtered = filtered.filter(p => p.on_sale);
        if (inStock) filtered = filtered.filter(p => p.in_stock);
        if (featured) filtered = filtered.filter(p => p.featured);

        // 5. Sort
        switch (currentSort.value) {
            case "price-asc":
                filtered.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
                break;
            case "price-desc":
                filtered.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
                break;
            default:
                // Keep default or use relevance if available
                break;
        }

        setProducts(filtered);

        console.log("--- Category Filter Debug ---");
        console.log("Total initial products:", initialProducts.length);
        console.log("Active Filters:", {
            brandIds,
            minPrice,
            maxPrice,
            ratings,
            onSale,
            inStock,
            featured
        });
        console.log("Filtered products found:", filtered.length);
        console.log("-----------------------------");
    }, [initialProducts, searchParams, currentSort]);


    return (
        <>
            <FlexBox
                as={Card}
                mb="24px"
                p="1.25rem"
                elevation={5}
                flexWrap="wrap"
                borderRadius={8}
                alignItems="center"
                justifyContent="space-between">
                <div>
                    <H5>Searching for “ {categoryName || "Category"} ”</H5>
                    <Paragraph color="text.muted">{totalProducts} results found</Paragraph>
                </div>

                <FlexBox alignItems="center" flexWrap="wrap">
                    <Paragraph color="text.muted" mr="1rem">
                        Sort by:
                    </Paragraph>

                    <Box flex="1 1 0" mr="1.75rem" minWidth="150px">
                        <Select
                            instanceId="category-sort-select"
                            placeholder="Sort by"
                            value={currentSort}
                            options={sortOptions}
                            onChange={handleSortChange}
                        />
                    </Box>

                    <Paragraph color="text.muted" mr="0.5rem">
                        View:
                    </Paragraph>

                    <IconButton onClick={toggleView("grid")}>
                        <Icon
                            variant="small"
                            defaultcolor="auto"
                            color={view === "grid" ? "primary" : "inherit"}>
                            grid
                        </Icon>
                    </IconButton>

                    <IconButton onClick={toggleView("list")}>
                        <Icon
                            variant="small"
                            defaultcolor="auto"
                            color={view === "list" ? "primary" : "inherit"}>
                            menu
                        </Icon>
                    </IconButton>

                    {isTablet && (
                        <Sidenav
                            position="left"
                            scroll={true}
                            handle={
                                <IconButton>
                                    <Icon>options</Icon>
                                </IconButton>
                            }>
                            <ProductFilterCard
                                brands={brands}
                                categories={categories}
                                minPriceDefault={minPriceDefault}
                                maxPriceDefault={maxPriceDefault}
                            />
                        </Sidenav>
                    )}
                </FlexBox>
            </FlexBox>

            <Grid container vertical_spacing={3} horizontal_spacing={0.5}>
                <Grid item lg={3} xs={12}>
                    <ProductFilterCard
                        brands={brands}
                        minPriceDefault={minPriceDefault}
                        maxPriceDefault={maxPriceDefault}
                        categories={categories}
                    />
                </Grid>

                <Grid item lg={9} xs={12}>
                    {view === "grid" ? (
                        <ProductGridView
                            products={products}
                            categorySlug={categoryName}
                            totalPages={totalPages}
                            currentPage={currentPage}
                        />
                    ) : (
                        <ProductListView
                            products={products}
                            categorySlug={categoryName}
                            totalPages={totalPages}
                            currentPage={currentPage}
                        />
                    )}
                </Grid>
            </Grid>

            {categoryDescription && (
                <Card 
                    elevation={10} 
                    p="1.5rem 2rem" 
                    mt="5rem" 
                    mb="4rem"
                    borderRadius={20} 
                    style={{ 
                        lineHeight: 1.9, 
                        width: "100%",
                        background: "linear-gradient(135deg, #ffffff 0%, #fdfdff 100%)",
                        boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.05)",
                        border: "1px solid #ebf2f7",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    {/* Decorative Accent */}
                    <Box
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "8px",
                            backgroundColor: "#d23f57", // Primary red
                            backgroundImage: "linear-gradient(180deg, #d23f57 0%, #f16279 100%)",
                            borderRadius: "10px 0 0 10px"
                        }}
                    />

                    <ArticleWrapper
                        dangerouslySetInnerHTML={{ __html: categoryDescription }}
                    />
                </Card>
            )}
        </>
    );
}

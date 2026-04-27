"use client";

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

// ==============================================================
type Props = {
  sortOptions: { label: string; value: string }[];
  products: any[];
  title?: string;
  brands?: any[];
  categories?: any[];
};
// ==============================================================

export default function SearchResult({
  sortOptions,
  products: initialProducts,
  title = "Searching for products",
  brands = [],
  categories = []
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const width = useWindowSize();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState(initialProducts);

  const currentSortValue = searchParams.get("sort") || "relevance";
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

    // 1. Filter by Brand
    const brandIds = searchParams.get("brand_id")?.split(",").filter(Boolean) || [];
    if (brandIds.length > 0) {
      filtered = filtered.filter(p => p.brandId && brandIds.includes(String(p.brandId)));
    }

    // 2. Filter by Price
    const minPrice = Number(searchParams.get("min_price"));
    const maxPrice = Number(searchParams.get("max_price"));
    if (minPrice) filtered = filtered.filter(p => p.price >= minPrice);
    if (maxPrice) filtered = filtered.filter(p => p.price <= maxPrice);

    // 3. Filter by Ratings
    const ratings = searchParams.get("ratings")?.split(",").filter(Boolean) || [];
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
      case "date":
        filtered.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      default:
        // Relevance or default: keep as is (API order)
        break;
    }

    setProducts(filtered);

    console.log("--- Filter Debug ---");
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
    console.log("--------------------");
  }, [initialProducts, searchParams, currentSort]);

  // Calculate min/max price from products for dynamic slider
  const dynamicPriceRange = useMemo(() => {
    const prices = initialProducts.map(p => Number(p.price)).filter(p => !isNaN(p) && p > 0);
    return {
      min: prices.length > 0 ? Math.floor(Math.min(...prices)) : 0,
      max: prices.length > 0 ? Math.ceil(Math.max(...prices)) : 10000
    };
  }, [initialProducts]);


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
          <H5>{title}</H5>
          <Paragraph color="text.muted">{products.length} items found</Paragraph>
        </div>

        <FlexBox alignItems="center" flexWrap="wrap">
          <Paragraph color="text.muted" mr="1rem">
            Sort by:
          </Paragraph>

          <Box flex="1 1 0" mr="1.75rem" minWidth="150px">
            <Select
              instanceId="search-sort-select"
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
                minPriceDefault={dynamicPriceRange.min}
                maxPriceDefault={dynamicPriceRange.max}
              />
            </Sidenav>
          )}
        </FlexBox>
      </FlexBox>

      <Grid container vertical_spacing={3} horizontal_spacing={0.5}>
        <Grid item lg={3} xs={12}>
          <ProductFilterCard
            brands={brands}
            categories={categories}
            minPriceDefault={dynamicPriceRange.min}
            maxPriceDefault={dynamicPriceRange.max}
          />
        </Grid>

        <Grid item lg={9} xs={12}>
          {view === "grid" ? (
            <ProductGridView products={products} />
          ) : (
            <ProductListView products={products} />
          )}
        </Grid>
      </Grid>
    </>
  );
}

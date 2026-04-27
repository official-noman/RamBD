"use client";

import Card from "@component/Card";
import Box from "@component/Box";
import Avatar from "@component/avatar";
import Rating from "@component/rating";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import CheckBox from "@component/CheckBox";
import TextField from "@component/text-field";
import { Accordion, AccordionHeader } from "@component/accordion";
import { H5, H6, Paragraph, SemiSpan } from "@component/Typography";

import { Button } from "@component/buttons";
import Icon from "@component/icon/Icon";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

const StyledSlider = styled(Slider)`
  .rc-slider-rail {
    background-color: ${themeGet("colors.gray.300")};
  }
  .rc-slider-track {
    background-color: #7ED321; /* Match the green in screenshot */
  }
  .rc-slider-handle {
    border: solid 2px #7ED321;
    background-color: #fff;
    opacity: 1;
    &:focus, &:active, &:hover {
      border-color: #7ED321;
      box-shadow: 0 0 0 5px rgba(126, 211, 33, 0.2);
    }
  }
`;

type Props = {
  categories?: any[];
  brands?: { id: string, name: string }[];
  ratings?: number[];
  minPriceDefault?: number;
  maxPriceDefault?: number;
};

export default function ProductFilterCard({
  categories = [],
  brands = [],
  ratings = [],
  minPriceDefault = 0,
  maxPriceDefault = 10000
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || minPriceDefault.toString());
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || maxPriceDefault.toString());

  useEffect(() => {
    // Only update state if no specific search param is set OR if the defaults change
    // This ensures that when the page first loads and products arrive, the fields update.
    const urlMin = searchParams.get("min_price");
    const urlMax = searchParams.get("max_price");

    setMinPrice(urlMin ?? minPriceDefault.toString());
    setMaxPrice(urlMax ?? maxPriceDefault.toString());
  }, [searchParams, minPriceDefault, maxPriceDefault]);

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      const [min, max] = values;
      setMinPrice(min.toString());
      setMaxPrice(max.toString());
    }
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.set("min_price", minPrice);
    params.set("max_price", maxPrice);
    params.set("page", "1"); // Reset to page 1 on filter
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSliderChangeComplete = (values: number | number[]) => {
    if (Array.isArray(values)) {
      applyPriceFilter();
    }
  };

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleBrandChange = (brand: string) => {
    const currentBrands = searchParams.get("brand_id")?.split(",") || [];
    let updated;
    if (currentBrands.includes(brand)) {
      updated = currentBrands.filter(b => b !== brand);
    } else {
      updated = [...currentBrands, brand];
    }
    updateParam("brand_id", updated.join(",") || null);
  };

  const handleRatingChange = (rating: number) => {
    const currentRatings = searchParams.get("ratings")?.split(",") || [];
    const rStr = rating.toString();
    let updated;
    if (currentRatings.includes(rStr)) {
      updated = currentRatings.filter(r => r !== rStr);
    } else {
      updated = [...currentRatings, rStr];
    }
    updateParam("ratings", updated.join(",") || null);
  };

  const selectedBrands = searchParams.get("brand_id")?.split(",") || [];
  const selectedRatings = searchParams.get("ratings")?.split(",") || [];

  const handleAvailabilityChange = (key: string) => {
    const params = new URLSearchParams(searchParams);
    if (params.get(key) === "true") {
      params.delete(key);
    } else {
      params.set(key, "true");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (path: string) => {
    router.push(`/category/${path}`);
  };

  const render = (items: any[], parentPath: string) =>
    items.map((item) => {
      const currentPath = `${parentPath}/${item.slug}`;
      return (
        <Paragraph
          py="6px"
          pl="22px"
          key={item.id || item.slug}
          fontSize="14px"
          color="text.muted"
          className="cursor-pointer"
          onClick={() => handleCategoryChange(currentPath)}>
          {item.name || item.title}
        </Paragraph>
      );
    });

  return (
    <Card p="18px 27px" elevation={5} borderRadius={8}>
      <Button
        color="primary"
        variant="outlined"
        fullwidth
        size="large"
        mb="24px"
        onClick={() => router.back()}
        style={{ fontWeight: 700, fontSize: "16px" }}>
        <FlexBox alignItems="center" justifyContent="center">
          <Icon variant="small" mr="10px">
            arrow-left
          </Icon>
          Back to Previous
        </FlexBox>
      </Button>

      <H6 mb="10px">Categories</H6>

      {categories.map((item) =>
        item.children && item.children.length > 0 ? (
          <Accordion key={item.id || item.slug} expanded={pathname.includes(item.slug)}>
            <AccordionHeader px="0px" py="6px" color="text.muted">
              <SemiSpan
                className="cursor-pointer"
                mr="9px"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryChange(item.slug);
                }}>
                {item.name || item.title}
              </SemiSpan>
            </AccordionHeader>

            {render(item.children, item.slug)}
          </Accordion>
        ) : (
          <Paragraph
            py="6px"
            fontSize="14px"
            key={item.id || item.slug}
            color={pathname.includes(item.slug) ? "primary.main" : "text.muted"}
            className="cursor-pointer"
            onClick={() => handleCategoryChange(item.slug)}>
            {item.name || item.title}
          </Paragraph>
        )
      )}

      <Divider mt="18px" mb="24px" />

      {/* PRICE RANGE FILTER */}
      <H6 mb="16px">Price Range</H6>
      <Box mb="24px" px="5px">
        <StyledSlider
          range
          min={minPriceDefault}
          max={maxPriceDefault}
          value={[Number(minPrice) || minPriceDefault, Number(maxPrice) || maxPriceDefault]}
          onChange={handlePriceChange}
          onChangeComplete={handleSliderChangeComplete}
        />
      </Box>
      <FlexBox justifyContent="space-between" alignItems="center">
        <TextField
          placeholder="Min"
          type="number"
          fullwidth
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          onBlur={applyPriceFilter}
          onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
        />

        <H5 color="text.muted" px="0.5rem">
          -
        </H5>

        <TextField
          placeholder="Max"
          type="number"
          fullwidth
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          onBlur={applyPriceFilter}
          onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
        />
      </FlexBox>

      <Divider my="24px" />

      {/* BRANDS FILTER */}
      <H6 mb="16px">Brands</H6>
      {brands.map((item) => (
        <CheckBox
          my="10px"
          key={item.id}
          name={item.name}
          value={item.id}
          color="secondary"
          checked={selectedBrands.includes(item.id)}
          label={<SemiSpan color="inherit">{item.name}</SemiSpan>}
          onChange={() => handleBrandChange(item.id)}
        />
      ))}

      <Divider my="24px" />

      <Divider my="24px" />

      {/* STOCK AND SALES FILTERS */}
      <H6 mb="16px">Availability</H6>
      <CheckBox
        my="10px"
        name="on_sale"
        value="on_sale"
        color="secondary"
        checked={searchParams.get("on_sale") === "true"}
        label={<SemiSpan color="inherit">On Sale</SemiSpan>}
        onChange={() => handleAvailabilityChange("on_sale")}
      />
      <CheckBox
        my="10px"
        name="in_stock"
        value="in_stock"
        color="secondary"
        checked={searchParams.get("in_stock") === "true"}
        label={<SemiSpan color="inherit">In Stock</SemiSpan>}
        onChange={() => handleAvailabilityChange("in_stock")}
      />
      <CheckBox
        my="10px"
        name="featured"
        value="featured"
        color="secondary"
        checked={searchParams.get("featured") === "true"}
        label={<SemiSpan color="inherit">Featured</SemiSpan>}
        onChange={() => handleAvailabilityChange("featured")}
      />

      <Divider my="24px" />

      {/* RATING FILTER */}
      <H6 mb="16px">Ratings</H6>
      {(ratings.length > 0 ? ratings : [5, 4, 3, 2, 1]).map((item) => (
        <CheckBox
          my="10px"
          key={item}
          value={item}
          color="secondary"
          checked={selectedRatings.includes(item.toString())}
          label={<Rating value={item} outof={5} color="warn" />}
          onChange={() => handleRatingChange(item)}
        />
      ))}

      <Divider my="24px" />

      {/* COLORS FILTER */}
      {/* <H6 mb="16px">Colors</H6>
      <FlexBox mb="1rem">
        {colorList.map((item, ind) => (
          <Avatar key={ind} bg={item} size={25} mr="10px" style={{ cursor: "pointer" }} />
        ))}
      </FlexBox> */}
    </Card>
  );
}

const otherOptions = ["On Sale", "In Stock", "Featured"];
const colorList = ["#1C1C1C", "#FF7A7A", "#FFC672", "#84FFB5", "#70F6FF", "#6B7AFF"];

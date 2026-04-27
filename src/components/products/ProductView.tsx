"use client";

import { useState } from "react";

import Box from "@component/Box";
import Shop from "@models/shop.model";
import FlexBox from "@component/FlexBox";
import { H5 } from "@component/Typography";
import Product from "@models/product.model";
import ProductReview from "@component/products/ProductReview";
import RelatedProducts from "@component/products/RelatedProducts";
import ProductDescription from "@component/products/ProductDescription";
import ProductSpecification from "@component/products/ProductSpecification";

// ==============================================================
type Props = {
  shops: Shop[];
  product: Product;
  relatedProducts: Product[];
  frequentlyBought: Product[];
};
// ==============================================================

export default function ProductView({ product }: Omit<Props, "shops" | "frequentlyBought" | "relatedProducts">) {
  console.log("ProductView reviews:", product.reviews);
  const [selectedOption, setSelectedOption] = useState("specification");
  const handleOptionClick = (opt: any) => () => setSelectedOption(opt);

  return (
    <Box bg="white" p="1.5rem" borderRadius={8} shadow={1} flex="1">
      <FlexBox borderBottom="1px solid" borderColor="gray.300" mb="1.5rem">
        <H5
          mr="25px"
          p="8px 10px"
          className="cursor-pointer"
          borderColor="primary.main"
          onClick={handleOptionClick("specification")}
          borderBottom={selectedOption === "specification" ? "3px solid" : ""}
          color={selectedOption === "specification" ? "primary.main" : "text.muted"}
          transition="all 0.2s"
          fontWeight={selectedOption === "specification" ? "700" : "500"}>
          Specification
        </H5>

        <H5
          mr="25px"
          p="8px 10px"
          className="cursor-pointer"
          borderColor="primary.main"
          onClick={handleOptionClick("description")}
          borderBottom={selectedOption === "description" ? "3px solid" : ""}
          color={selectedOption === "description" ? "primary.main" : "text.muted"}
          transition="all 0.2s"
          fontWeight={selectedOption === "description" ? "700" : "500"}>
          Description
        </H5>

        <H5
          p="8px 10px"
          className="cursor-pointer"
          borderColor="primary.main"
          onClick={handleOptionClick("review")}
          borderBottom={selectedOption === "review" ? "3px solid" : ""}
          color={selectedOption === "review" ? "primary.main" : "text.muted"}
          transition="all 0.2s"
          fontWeight={selectedOption === "review" ? "700" : "500"}>
          Review ({product.reviews?.length || 0})
        </H5>
      </FlexBox>

      {/* DESCRIPTION AND REVIEW TAB DETAILS */}
      <Box pb="1rem">
        {selectedOption === "specification" && <ProductSpecification product={product} />}
        {selectedOption === "description" && <ProductDescription description={product.description} />}
        {selectedOption === "review" && (
          <ProductReview
            reviews={product.reviews}
            slug={product.pro_slug || product.slug}
            model={product.model}
            productId={product.id}
          />
        )}
      </Box>
    </Box>
  );
}

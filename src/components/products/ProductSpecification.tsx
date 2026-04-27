"use client";

import { H3 } from "@component/Typography";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";

import { extractSpecifications } from "@utils/utils";
import Product from "@models/product.model";

export default function ProductSpecification({ product }: { product: Product }) {
    const { specs: extractedSpecs } = extractSpecifications(product.description || "");

    // Prepare a base set of specs from structured data
    const baseSpecs = [
        { label: "Brand", value: product.brand || "Felna Tech" },
        { label: "Model", value: product.model || "N/A" },
        { label: "Category", value: product.categoryName || "General" },
        { label: "Status", value: product.status || "Yes" },
        { label: "Product Code", value: product.product_code || product.id },
    ];

    // Merge extracted specs, avoiding duplicates with base specs
    const finalSpecs = [...baseSpecs];
    
    extractedSpecs.forEach(ext => {
        const alreadyExists = finalSpecs.some(s => s.label.toLowerCase() === ext.label.toLowerCase());
        if (!alreadyExists) {
            finalSpecs.push(ext);
        }
    });

    return (
        <Box>
            <H3 mb="1.5rem">Specifications</H3>

            {finalSpecs.map((spec, ind) => (
                <FlexBox
                    key={ind}
                    py="10px"
                    px="15px"
                    bg={ind % 2 === 0 ? "gray.100" : "white"}
                    borderBottom="1px solid"
                    borderColor="gray.300"
                    alignItems="center"
                >
                    <Box width="30%" color="text.muted" fontWeight="600">{spec.label}</Box>
                    <Box width="70%">{spec.value}</Box>
                </FlexBox>
            ))}
        </Box>
    );
}

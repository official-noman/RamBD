"use client";

import Box from "@component/Box";
import { H3 } from "@component/Typography";
import { Carousel } from "@component/carousel";
import { ProductCard1 } from "@component/product-cards";
import Product from "@models/product.model";

// ============================================================
type Props = { products: Product[] };
// ============================================================

export default function RelatedProducts({ products }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <Box mb="2px" mt="1.5rem">
      <H3 mb="1.5rem" fontWeight="700">Related Products</H3>

      <Carousel
        spaceBetween={2}
        slidesToShow={5}
        responsive={[
          { breakpoint: 1200, settings: { slidesToShow: 4 } },
          { breakpoint: 1024, settings: { slidesToShow: 3 } },
          { breakpoint: 650, settings: { slidesToShow: 2 } },
          { breakpoint: 426, settings: { slidesToShow: 1 } }
        ]}
        autoplay={true}
        autoplaySpeed={3000}>
        {products.map((item) => {
          // Fallback slug generation in case API/Cache returns empty
          const effectiveSlug = item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '');

          return (
            <Box p="2px" key={item.id} height="100%">
              <ProductCard1
                hoverEffect
                showActionButtons={true}
                id={item.id}
                slug={effectiveSlug}
                price={item.price}
                regularPrice={item.regularPrice}
                title={item.title}
                off={item.discount}
                images={item.images}
                imgUrl={item.thumbnail}
                rating={item.rating || 4}
              />
            </Box>
          );
        })}
      </Carousel>
    </Box>
  );
}

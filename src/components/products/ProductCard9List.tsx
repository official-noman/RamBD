"use client";
import { Fragment } from "react";

import FlexBox from "@component/FlexBox";
import Pagination from "@component/pagination";
import { SemiSpan } from "@component/Typography";
import { ProductCard9 } from "@component/product-cards";
import Product from "@models/product.model";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

// ==========================================================
type Props = {
  products: Product[];
  categorySlug?: string;
  totalPages?: number;
  currentPage?: number;
};
// ==========================================================

export default function ProductListView({ products, categorySlug, totalPages = 1, currentPage = 1 }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", (page + 1).toString());
    router.push(`${pathname}?${params.toString()}`);
    // Scroll to top
    window.scrollTo(0, 0);
  };
  return (
    <Fragment>
      {products.map((item) => (
        <ProductCard9
          mb="1.25rem"
          id={item.id}
          key={item.id}
          slug={item.slug}
          price={item.price}
          title={item.title}
          off={item.discount}
          rating={item.rating}
          images={item.images}
          imgUrl={item.thumbnail}
          regularPrice={item.regularPrice}
          categories={item.categories}
          categorySlug={categorySlug}
        />
      ))}

      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt="32px">
        <SemiSpan>Showing {(currentPage - 1) * 16 + 1}-{Math.min(currentPage * 16, (currentPage - 1) * 16 + products.length)} of Products</SemiSpan>
        <Pagination
          pageCount={totalPages}
          forcePage={currentPage - 1}
          onChange={handlePageChange}
        />
      </FlexBox>
    </Fragment>
  );
}

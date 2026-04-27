"use client";
import FlexBox from "@component/FlexBox";
import Grid from "@component/grid/Grid";
import Pagination from "@component/pagination";
import { ProductCard19 } from "@component/product-cards";
import { SemiSpan } from "@component/Typography";
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

export default function ProductCard19List({
    products,
    categorySlug,
    totalPages = 1,
    currentPage = 1
}: Props) {
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
        <div>
            <Grid container spacing={1}>
                {products.map((item) => (
                    <Grid item lg={3} sm={6} xs={12} key={item.id}>
                        <ProductCard19
                            id={item.id}
                            slug={item.slug}
                            price={item.price}
                            name={item.title}
                            off={item.discount}
                            regularPrice={item.regularPrice}
                            img={item.thumbnail}
                            images={item.images as string[]}
                            reviews={item.rating || 5}
                            categorySlug={categorySlug}
                        />
                    </Grid>
                ))}
            </Grid>

            <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt="32px">
                <SemiSpan>Showing {(currentPage - 1) * 16 + 1}-{Math.min(currentPage * 16, (currentPage - 1) * 16 + products.length)} of Products</SemiSpan>
                <Pagination
                    pageCount={totalPages}
                    forcePage={currentPage - 1}
                    onChange={handlePageChange}
                />
            </FlexBox>
        </div>
    );
}

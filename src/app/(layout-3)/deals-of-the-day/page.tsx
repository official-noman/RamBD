import Box from "@component/Box";
import api from "@utils/__api__/market-2";
import SearchResult from "../product/search/[slug]/SearchResult";

export const dynamic = 'force-dynamic';

export default async function DealsOfTheDayPage() {
    const [products, brands, categories] = await Promise.all([
        api.getTopRatedProducts(),
        api.getBrands(),
        api.getCategories()
    ]);

    return (
        <Box pt="0px">
            <SearchResult
                title="Deals Of The Day"
                sortOptions={sortOptions}
                products={products}
                brands={brands}
                categories={categories}
            />
        </Box>
    );
}

const sortOptions = [
    { label: "Default", value: "relevance" },
    { label: "Price Low to High", value: "price-asc" },
    { label: "Price High to Low", value: "price-desc" }
];

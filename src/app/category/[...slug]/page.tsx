import { Metadata } from "next";
import Box from "@component/Box";
import CategorySearchResult from "./CategorySearchResult";
import categoryProductApi from "@utils/__api__/category-products";
import market2Api from "@utils/__api__/market-2";

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
    const { slug } = await params;
    const lastSlug = slug[slug.length - 1];
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info";

    try {
        // Directly fetch category-specific metadata from the items endpoint
        const response = await fetch(`${apiBaseUrl}/product/product-category-items/${lastSlug}`, { next: { revalidate: 3600 } });
        const data = await response.json();

        const title = data.cat_meta_title || data.categoryName || `${lastSlug.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} | RamBD`;
        const description = data.cat_meta_description || `Browse the best collection of ${data.categoryName || lastSlug} at RamBD. Best prices and fastest delivery.`;
        const keywords = data.cat_meta_keys || "";

        return {
            title,
            description,
            keywords: keywords,
            openGraph: {
                title,
                description,
                images: data.cat_meta_image ? [data.cat_meta_image] : [],
            }
        };
    } catch (error) {
        console.error("Metadata fetch failed for category:", lastSlug, error);
        return { title: "Category | RamBD" };
    }
}

// ==============================================================
type Props = {
    params: Promise<{ slug: string[] }>;
    searchParams: Promise<{
        min_price?: string;
        max_price?: string;
        page?: string;
        sort?: string;
        in_stock?: string;
        on_sale?: string;
        featured?: string;
        brand_id?: string;
    }>;
};
// ==============================================================

export default async function CategoryProductPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const lastSlug = slug[slug.length - 1];
    const categoryName = lastSlug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    const sParams = await searchParams;
    const pageNumber = sParams.page ? Number(sParams.page) : 1;
    const { sort, min_price, max_price, in_stock, on_sale, featured, brand_id: brandIds } = sParams;

    // Pass the full slug array so the API can resolve the correct category ID
    // This fixes the issue where same-named subcategories (e.g. "rambd") under different
    // parents (wire-mic vs wireless-mic) were returning identical products.
    const { products, totalPages, totalProducts } = await categoryProductApi.getProductsByCategory(
        slug,
        min_price,
        max_price,
        pageNumber,
        sort,
        brandIds
    );

    // Fetch real categories and brands for sidebar
    const [categories, allBrands] = await Promise.all([
        market2Api.getCategories(),
        market2Api.getBrands()
    ]);

    // Find current category info
    const findCategoryInfo = (cats: any[], slugArray: string[]): { name: string, description: string | null } | null => {
        let currentLevel = cats;
        let lastFound = null;

        for (let i = 0; i < slugArray.length; i++) {
            const slug = slugArray[i];
            const cat = currentLevel.find(c => c.slug === slug);
            if (!cat) return lastFound; // Return parent if child not found? No, should be exact.
            
            if (i === slugArray.length - 1) {
                return { 
                    name: cat.name, 
                    description: cat.description || cat.cate_desc || null 
                };
            }
            currentLevel = cat.children || [];
        }
        return null;
    };

    const categoryInfo = findCategoryInfo(categories, slug);
    
    // Check if description is missing or just a placeholder like "no description"
    const isPlaceholder = (desc: string | null) => {
        if (!desc) return true;
        const normalized = desc.toLowerCase().replace(/[!.\s]+/g, ' ').trim();
        const placeholders = ["no description", "null", "undefined", "empty", "no desc"];
        
        const isMatch = placeholders.some(p => normalized.includes(p)) || normalized === "";
        
        // Also check for HTML wrapped placeholders
        const stripped = desc.replace(/<[^>]*>?/gm, '').toLowerCase().replace(/[!.\s]+/g, ' ').trim();
        const isStrippedMatch = placeholders.some(p => stripped.includes(p)) || stripped === "";
        
        return isMatch || isStrippedMatch;
    };

    const resolvedDescription = !isPlaceholder(categoryInfo?.description) 
        ? categoryInfo?.description 
        : (categoryInfo ? `<h1 class="fallback-title">${categoryInfo.name}</h1>` : null);

    // Calculate min/max price from products if not provided
    const productPrices = products.map(p => p.price).filter(p => p > 0);
    const minPriceDynamic = productPrices.length > 0 ? Math.min(...productPrices) : 0;
    const maxPriceDynamic = productPrices.length > 0 ? Math.max(...productPrices) : 20000;

    return (
        <Box pt="0px">
            <CategorySearchResult
                sortOptions={sortOptions}
                products={products}
                categoryName={categoryName}
                categoryDescription={resolvedDescription}
                totalPages={totalPages}
                totalProducts={totalProducts}
                currentPage={pageNumber}
                minPriceDefault={minPriceDynamic}
                maxPriceDefault={maxPriceDynamic}
                categories={categories}
                brands={allBrands}
            />
        </Box>
    );
}

const sortOptions = [
    { label: "Default", value: "relevance" },
    { label: "Price Low to High", value: "price-asc" },
    { label: "Price High to Low", value: "price-desc" }
];

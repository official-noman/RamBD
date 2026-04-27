
import axios from "@lib/axios";
import Product from "@models/product.model";
import { transformApiProduct } from "@utils/productTransformer";

const API_BASE = () =>
    (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();

/**
 * Resolves the correct category slug and its parent's ID by traversing the
 * categories tree using a full slug path array.
 *
 * Example:
 *   ["microphone", "wire-mic", "rambd"]     → { slug: "rambd", parentId: 32 }
 *   ["microphone", "wireless-mic", "rambd"] → { slug: "rambd", parentId: 20 }
 *
 * The parent_id is passed as a query param to the API so it can distinguish
 * between two subcategories that share the same slug under different parents.
 * Fallback: returns last slug with no parentId if traversal fails.
 */
async function resolveCategoryInfo(
    slugs: string[]
): Promise<{ slug: string; parentId: number | null }> {
    const lastSlug = slugs[slugs.length - 1];
    if (slugs.length <= 1) return { slug: lastSlug, parentId: null };

    try {
        const response = await axios.get(`${API_BASE()}/home-menu`, {
            headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
        });
        const data = response.data;
        if (!data) return { slug: lastSlug, parentId: null };

        const allSubs: any[] = data.subCategory || [];
        const topNodes: any[] = (data.menu || []).map((m: any) => m.category).filter(Boolean);

        /**
         * DFS walk: returns { id, parentId } of the leaf node that matches
         * the full slug path. parentId is the id of the node one level up.
         */
        const findLeaf = (
            nodes: any[],
            remainingSlugs: string[],
            currentParentId: number | null
        ): { id: number; parentId: number | null } | null => {
            if (!nodes || remainingSlugs.length === 0) return null;

            const [cur, ...rest] = remainingSlugs;

            for (const node of nodes) {
                if (node.cate_slug === cur) {
                    if (rest.length === 0) {
                        return { id: node.id, parentId: currentParentId };
                    }
                    const children =
                        node.sub_categories ||
                        node.category_sub_categories ||
                        node.children ||
                        allSubs.filter((c: any) => c.parent_id === node.id);

                    const found = findLeaf(children, rest, node.id);
                    if (found) return found;
                }
            }
            return null;
        };

        const result = findLeaf(topNodes, slugs, null);
        console.log(
            `[resolveCategoryInfo] path="${slugs.join("/")}" → slug="${lastSlug}" parentId=${result?.parentId ?? null}`
        );
        return { slug: lastSlug, parentId: result?.parentId ?? null };
    } catch (err) {
        console.warn("[resolveCategoryInfo] failed, falling back to last slug:", err);
        return { slug: lastSlug, parentId: null };
    }
}

const getProductsByCategory = async (
    slugArray: string[],
    minPrice?: string | string[],
    maxPrice?: string | string[],
    page: number = 1,
    sort?: string,
    brand_id?: string,
    providedParentId?: number
): Promise<{ products: Product[]; totalPages: number; totalProducts: number }> => {
    try {
        const categoryUrl = (
            process.env.NEXT_PUBLIC_CATEGORY_ITEMS_URL ||
            `${API_BASE()}/product/product-category-items`
        ).trim();

        const { slug, parentId: resolvedParentId } = await resolveCategoryInfo(slugArray);

        // Priority: providedParentId > resolvedParentId
        const parentId = providedParentId !== undefined ? providedParentId : resolvedParentId;

        let url = `${categoryUrl}/${slug}?page=${page}&limit=16`;

        // Pass parent_id so the API can distinguish same-slug categories under different parents
        if (parentId !== null) url += `&parent_id=${parentId}`;

        if (sort) url += `&sort=${sort}`;
        if (minPrice) url += `&min_price=${minPrice}`;
        if (maxPrice) url += `&max_price=${maxPrice}`;
        if (brand_id) url += `&brand_id=${brand_id}`;

        console.log(`[getProductsByCategory] Fetching: ${url}`);
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json"
            }
        });

        const data = response.data;

        if (!data || !data.products || !data.products.data) {
            console.warn("No data found for category:", slug, data);
            return { products: [], totalPages: 1, totalProducts: 0 };
        }
        console.log(`Found ${data.products.data.length} products for category="${slug}" parentId=${parentId}`);

        const products: Product[] = data.products.data.map((item: any) => {
            const transformed = transformApiProduct(item);
            if (!transformed) return null;

            if (!transformed.thumbnail || transformed.thumbnail.includes('default-product.png')) {
                const storageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL;
                if (item.product_thumbnail) {
                    transformed.thumbnail = `${storageBaseUrl}/${item.product_thumbnail}`;
                }
            }

            if (transformed.price === 0 && item.product_price) {
                transformed.price = Number(item.product_price);
            }

            transformed.categories = [slug];

            return transformed;
        }).filter((p: any) => p !== null);

        return {
            products,
            totalPages: data.products.last_page || 1,
            totalProducts: data.products.total || products.length
        };
    } catch (error: any) {
        console.error("Failed to fetch products by category.");
        console.error("Error details:", error);
        if (error.cause) console.error("Error cause:", error.cause);
        return { products: [], totalPages: 1, totalProducts: 0 };
    }
};

export default { getProductsByCategory };

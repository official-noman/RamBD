import Box from "@component/Box";
import SearchResult from "./SearchResult";
import api from "@utils/__api__/market-2";
import { Metadata } from "next";

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await paramsPromise;
  const slug = decodeURIComponent(params?.slug || '');

  try {
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();

    // 1. Try to find a matching category in home-menu
    const menuResponse = await fetch(`${apiBaseUrl}/home-menu`, { next: { revalidate: 3600 } });
    if (menuResponse.ok) {
      const data = await menuResponse.json();
      const categories = data.category || [];
      const category = categories.find((c: any) => c.cate_slug === slug);

      if (category) {
        const metadata: Metadata = {
          title: category.meta_title || `${category.cate_name} | RamBD`,
          description: category.meta_description || category.cate_desc?.replace(/<[^>]*>/g, '').slice(0, 160) || `Buy ${category.cate_name} at RamBD`,
        };
        if (category.cat_meta_keys) metadata.keywords = category.cat_meta_keys;
        return metadata;
      }
    }

    // 2. If no category matches, check if it's a specific product slug
    // We use the existing product search logic but look for an exact slug match
    const searchUrl = `${apiBaseUrl}/products/searchpro?search=${slug}`;
    const productResponse = await fetch(searchUrl, { cache: 'no-store' });

    if (productResponse.ok) {
      const pData = await productResponse.json();
      const products = pData.products?.data || (Array.isArray(pData.products) ? pData.products : []);

      // Look for an exact slug match in the search results
      const product = products.find((p: any) => p.pro_slug === slug);

      if (product) {
        const plainDescription = product.pro_meta_description || (product.product_description
          ? product.product_description.replace(/<[^>]*>/g, '').slice(0, 160)
          : `Buy ${product.pro_title} at RamBD`);

        const metadata: Metadata = {
          title: product.meta_title || `${product.pro_title} | RamBD`,
          description: plainDescription,
        };
        if (product.pro_meta_key) metadata.keywords = product.pro_meta_key;
        return metadata;
      }
    }

  } catch (error) {
    console.error("Error generating metadata for search slug:", error);
  }

  // Final fallback
  const displayTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    title: `${displayTitle} | RamBD`,
    description: `Browse ${displayTitle} at the best price from RamBD.`
  };
}

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  discount: number;
  thumbnail: string;
  images: string[];
  rating: number;
  categories: any[];
  status?: string;
}

import { transformApiProduct } from "@utils/productTransformer";



async function getProducts(slug: string): Promise<any[]> {
  try {
    // Handle specific keyword discrepancies (e.g., "trypod" vs "tripod")
    let searchKeyword = slug.toLowerCase().trim();
    if (searchKeyword === 'trypod') {
      searchKeyword = 'tripod';
    }

    const url = `https://admin.unicodeconverter.info/products/searchpro?search=${searchKeyword}`;

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });

    if (!res.ok) return [];

    const json = await res.json();
    const productData = json.products?.data || (Array.isArray(json.products) ? json.products : []);

    return productData.map(transformApiProduct).filter((p: any) => p !== null);
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

export default async function ProductSearchResult({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = await paramsPromise;
  const decodedSlug = decodeURIComponent(params?.slug || '');

  const [products, brands, categories] = await Promise.all([
    getProducts(decodedSlug),
    api.getBrands(),
    api.getCategories()
  ]);

  return (
    <Box pt="20px">
      <SearchResult
        title="Searching for products"
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


import { cache } from "react";
import axios from "@lib/axios";
import Product from "@models/product.model";
import Shop from "@models/shop.model";

import market2Api from "./market-2";
import categoryProductApi from "./category-products";
import { transformApiProduct } from "@utils/productTransformer";

// get all product slug
const getSlugs = async (): Promise<{ slug: string }[]> => {
  const response = await axios.get("/api/products/slug-list");
  return response.data;
};

// get product based on slug
const getProduct = cache(async (slug: string, categorySlug?: string): Promise<Product> => {
  let productData = null;

  try {
    // 1. Always try direct fetch first (Most common case)
    console.log(`Directly fetching product for slug: ${slug}`);
    const response = await axios.get("/api/products/slug", { params: { slug } });

    // If we have valid product data, set it
    if (response.data && (response.data.pro_title || response.data.id)) {
      productData = response.data.pro_title ? transformApiProduct(response.data) : response.data;
    }
  } catch (error) {
    console.log(`Initial fetch failed for slug: ${slug}, continuing to fallbacks...`);
  }

  // If we found it already, return it
  if (productData) return productData;

  // 2. Probing logic as fallback
  try {
    console.log(`Probing fallbacks for slug: ${slug}`);

    // Check market-2 APIs one by one if needed (or in smaller batches)
    const fallbackResults = await Promise.allSettled([
      market2Api.getLatestProducts(),
      market2Api.getMostPopularProducts(),
      market2Api.getTopRatedProducts()
    ]);

    const allRealProducts = fallbackResults
      .filter((res): res is PromiseFulfilledResult<any> => res.status === 'fulfilled')
      .map(res => {
        const val = res.value;
        return Array.isArray(val) ? val : (val.products || []);
      })
      .flat();

    let realProduct = allRealProducts.find((p) => (p as any).slug === slug);
    console.log(`Found in featured lists? ${!!realProduct}`);

    if (realProduct) return realProduct;

    // 3. Search Pro API fallback (Most reliable for arbitrary slugs)
    try {
      const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").trim();
      // Try searching with original slug first
      let searchUrl = `${apiBaseUrl}/products/searchpro?search=${slug}`;
      console.log(`Probing search API for unknown slug: ${searchUrl}`);
      let searchRes = await fetch(searchUrl, { cache: 'no-store' });
      let pData: any[] = [];

      if (searchRes.ok) {
        const searchJson = await searchRes.json();
        pData = searchJson.products?.data || (Array.isArray(searchJson.products) ? searchJson.products : []);
      }

      // If no match, try searching with hyphens replaced by spaces
      if (!pData.length && slug.includes('-')) {
        const spacedSlug = slug.replace(/-/g, ' ');
        searchUrl = `${apiBaseUrl}/products/searchpro?search=${spacedSlug}`;
        console.log(`Probing search API with spaced slug: ${searchUrl}`);
        searchRes = await fetch(searchUrl, { cache: 'no-store' });
        if (searchRes.ok) {
          const searchJson = await searchRes.json();
          pData = searchJson.products?.data || (Array.isArray(searchJson.products) ? searchJson.products : []);
        }
      }

      if (pData.length) {
        const match = pData.find((p: any) => p.pro_slug === slug || (p.pro_title && p.pro_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === slug));
        if (match) {
          console.log(`Matched product found in search API for slug: ${slug}`);
          return transformApiProduct(match);
        }
      }

      // Final fallback: If still no match, try searching for the first 3 words of the slug
      if (slug.includes('-')) {
        const firstWords = slug.split('-').slice(0, 3).join(' ');
        searchUrl = `${apiBaseUrl}/products/searchpro?search=${encodeURIComponent(firstWords)}`;
        console.log(`Final probing search API with keywords: ${searchUrl}`);
        const finalRes = await fetch(searchUrl, { cache: 'no-store' });
        if (finalRes.ok) {
          const finalJson = await finalRes.json();
          const finalPData = finalJson.products?.data || (Array.isArray(finalJson.products) ? finalJson.products : []);
          const finalMatch = finalPData.find((p: any) => p.pro_slug === slug || (p.pro_title && p.pro_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === slug));
          if (finalMatch) {
            console.log(`Final matched product found in search API for slug: ${slug}`);
            return transformApiProduct(finalMatch);
          }
        }
      }
    } catch (e) {
      console.error("Search API probe failed:", e);
    }

    if (categorySlug) {
      try {
        const catRes = await categoryProductApi.getProductsByCategory([categorySlug]);
        const match = catRes.products.find((p) => (p as any).slug === slug);
        if (match) return match;
      } catch (e) {
        console.error("Category fallback probe failed");
      }
    }
  } catch (error) {
    console.error("Error in getProduct fallback probing:", error);
  }

  return productData; // Might be null, handles Not Found
});

const getFrequentlyBought = cache(async (): Promise<Product[]> => {
  return market2Api.getTopRatedProducts();
});

const getRelatedProducts = cache(async (categorySlug?: string, parentId?: number): Promise<Product[]> => {
  try {
    if (categorySlug) {
      const res = await categoryProductApi.getProductsByCategory([categorySlug], undefined, undefined, 1, undefined, undefined, parentId);
      return res.products || [];
    }
  } catch (e) {
    console.error("Related products category fetch failed:", e);
  }
  return market2Api.getLatestProducts();
});

const getAvailableShop = cache(async (): Promise<Shop[]> => {
  const response = await axios.get("/api/product/shops");
  return response.data;
});

const getReviews = cache(async (slug: string, model: string): Promise<any[]> => {
  try {
    if (!model) return [];

    const cleanModel = model.trim();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info';
    const url = `${apiBaseUrl}/products/reviews-data/${slug}/${cleanModel}`;

    const response = await axios.get(url);
    const data = response.data;
    return data.proReview || [];
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
});

const postReview = async (slug: string, model: string, reviewData: { rating: number; message: string; client_id: number | string; pro_id?: number | string }): Promise<any> => {
  try {
    const cleanModel = model.trim();
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info').trim();
    // POST requires /api prefix while GET does not.
    const url = `${apiBaseUrl}/api/products/reviews-data/${slug}/${cleanModel}`;

    // Shotgun approach: Send ALL possible field names because the backend is returned nulls for rev_rating/rev_details
    const body: any = {
      rev_rating: reviewData.rating,
      rev_details: reviewData.message,
      rating: reviewData.rating,
      comment: reviewData.message,
      message: reviewData.message,
      details: reviewData.message,
      client_id: reviewData.client_id,
      slug: slug
    };

    // Only include pro_id and product_id if it's a numeric value
    if (reviewData.pro_id && !isNaN(Number(reviewData.pro_id))) {
      body.pro_id = Number(reviewData.pro_id);
      body.product_id = Number(reviewData.pro_id);
    }

    console.log("🚀 [REVIEWS] Submitting review to:", url, body);
    const response = await axios.post(url, body);
    return response.data;
  } catch (error) {
    console.error("❌ [REVIEWS] Failed to post review:", error);
    throw error;
  }
};

export default { getSlugs, getProduct, getFrequentlyBought, getRelatedProducts, getAvailableShop, getReviews, postReview };

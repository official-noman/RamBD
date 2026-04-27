import axios from "@lib/axios";
import Brand from "models/Brand.model";
import Product from "models/product.model";
import Service from "models/service.model";
import { CategoryBasedProducts, MainCarouselItem } from "models/market-2.model";
import { transformApiProduct, transformApiBrand } from "@utils/productTransformer";

const getProducts = async (): Promise<Product[]> => {
  return getLatestProducts();
};

const getServices = async (): Promise<Service[]> => {
  const response = await axios.get("/api/market-2/service");
  return response.data;
};

const getCategories = async () => {
  try {
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info').trim();
    const url = `${apiBaseUrl}/home-menu`;
    console.log(`[getCategories] Fetching from URL: "${url}"`);
    const response = await axios.get(url);
    const data = response.data;

    if (!data || !data.menu) return [];

    // Filter and sort menus
    const filteredMenus = (data.menu || []).filter((m: any) => Number(m.checked) === 1);
    const sortedMenus = filteredMenus.sort((a: any, b: any) => Number(a.menu_order) - Number(b.menu_order));

    // Map children by parent_id
    const childMap: Record<string | number, any[]> = {};
    if (Array.isArray(data.subCategory)) {
      data.subCategory.forEach(sub => {
        if (sub.parent_id) {
          if (!childMap[sub.parent_id]) childMap[sub.parent_id] = [];
          childMap[sub.parent_id].push(sub);
        }
      });
    }

    // Helper to map subcategories recursively
    const mapSubCategories = (subs?: any[]): any[] | undefined => {
      const mapped = subs?.map(sub => ({
        id: sub.id,
        name: sub.cate_name,
        slug: sub.cate_slug,
        description: sub.cate_desc || null,
        meta_title: sub.meta_title || null,
        meta_description: sub.meta_description || null,
        meta_keywords: sub.cat_meta_keys || null,
        children: mapSubCategories(sub.sub_categories || sub.category_sub_categories || sub.children || childMap[sub.id])
      }));
      return mapped && mapped.length > 0 ? mapped : undefined;
    };

    const categories = sortedMenus.map((m: any) => {
      const cate = m.category;
      let iconClass = cate.cate_icon || 'fas fa-th-large';
      if (iconClass.includes('<i') && iconClass.includes('class=')) {
        const match = iconClass.match(/class=(['"])(.*?)\1/);
        if (match && match[2]) {
          iconClass = match[2];
        } else {
          // fallback if regex fails but it is still an html tag
          const match2 = iconClass.match(/class=([^ >]+)/);
          if (match2 && match2[1]) iconClass = match2[1].replace(/['"]/g, '');
        }
      }

      if (iconClass.length > 0 && !iconClass.includes(' ') && !iconClass.startsWith('fa-') && !iconClass.startsWith('fas ') && !iconClass.startsWith('fab ')) {  
        // e.g. "tripod" -> "fas fa-tripod"
        iconClass = `fas fa-${iconClass.toLowerCase()}`;
        if (iconClass === 'fas fa-trypod' || iconClass === 'fas fa-tripod') {
          iconClass = 'fas fa-camera'; // Fallback as FA free lacks tripod
        }
      }

      return {
        id: cate.id,
        name: cate.cate_name,
        slug: cate.cate_slug,
        icon: iconClass,
        description: cate.cate_desc || null,
        meta_title: cate.meta_title || null,
        meta_description: cate.meta_description || null,
        meta_keywords: cate.cat_meta_keys || null,
        children: mapSubCategories(cate.sub_categories || cate.category_sub_categories || cate.children || childMap[cate.id]),
        image: cate.cate_img && cate.cate_img !== 'default.png'
          ? `https://admin.unicodeconverter.info/storage/app/public/category/${cate.cate_img}`
          : '/assets/images/categories/camera.png'
      };
    });
    return categories;
  } catch (error: any) {
    console.error("[getCategories] face error:", error.message);
    return [];
  }
};

const getBrands = async (): Promise<Brand[]> => {
  try {
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info').trim();
    const url = `${apiBaseUrl}/brand/getAllBrandsLast`;
    console.log(`Fetching brands from: ${url}`);
    const response = await axios.get(url);
    const data = response.data;
    const brands = data.brands || [];
    return brands.map(transformApiBrand);
  } catch (error: any) {
    console.error("getBrands face error:", error.message);
    if (error.cause) console.error("getBrands error cause:", error.cause);
    return [];
  }
};

const getMainCarouselData = async (): Promise<MainCarouselItem[]> => {
  try {
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info').trim();
    const url = `${apiBaseUrl}/home`;
    console.log(`Fetching carousel data from: ${url}`);
    const response = await axios.get(url);
    const data = response.data;
    const sliders = data.sliders || [];

    // Map API slider items to MainCarouselItem model
    return sliders.map((item: any) => {
      // API returns gal_img for filename, gal_title for title
      // Images are stored under /storage/app/public/gallery/
      const imgPath = item.gal_img || item.slider_img || item.image || item.img || "";
      const fullImgUrl = imgPath
        ? (imgPath.startsWith('http')
          ? imgPath
          : `https://admin.unicodeconverter.info/storage/app/public/gallery/${imgPath}`)
        : "";

      return {
        title: item.gal_title || item.title || item.slider_title || "",
        imgUrl: fullImgUrl,
        category: item.category || item.category_name || "",
        discount: item.discount || item.pct_off || 0,
        buttonText: item.button_text || "Shop Now",
        buttonLink: item.button_link || item.url || item.link || "#",
        description: item.description || item.sub_title || ""
      };
    });
  } catch (error: any) {
    console.error("getMainCarouselData error:", error.message);
    if (error.cause) console.error("getMainCarouselData error cause:", error.cause);
    return [];
  }
};

const getElectronicsProducts = async (): Promise<CategoryBasedProducts> => {
  const response = await axios.get("/api/market-2/category-based-product?tag=electronics");
  return response.data;
};

const getMenFashionProducts = async (): Promise<CategoryBasedProducts> => {
  const response = await axios.get("/api/market-2/category-based-product?tag=men");
  return response.data;
};

const getWomenFashionProducts = async (): Promise<CategoryBasedProducts> => {
  const response = await axios.get("/api/market-2/category-based-product?tag=women");
  return response.data;
};

const getLatestProducts = async (): Promise<Product[]> => {
  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info').trim();
  const url = `${apiBaseUrl}/LatestProductList/getAllLatestProducts`;

  try {
    console.log(`Fetching latest products from: ${url}`);
    const response = await axios.get(url);

    let products = [];
    if (response.status === 200) {
      const data = response.data;
      products = data.products || [];
    }

    // Fallback if latest is empty
    if (products.length === 0) {
      console.log("Latest products API empty, falling back to most popular");
      return getMostPopularProducts();
    }

    return products.map(transformApiProduct).filter((p: any) => p !== null);
  } catch (error: any) {
    console.error(`getLatestProducts error URL: ${url}`, error.message);
    if (error.code === 'ECONNABORTED') console.error("getLatestProducts Request timed out");
    if (error.cause) console.error("getLatestProducts error cause:", error.cause);
    return getMostPopularProducts();
  }
};

const getMostPopularProducts = async (): Promise<Product[]> => {
  try {
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info').trim();
    const url = `${apiBaseUrl}/most-popular-product`;
    console.log(`Fetching popular products from: ${url}`);
    const response = await axios.get(url);
    const data = response.data;
    const products = data.populars || [];
    return products.map(transformApiProduct).filter((p: any) => p !== null);
  } catch (error: any) {
    console.error("getMostPopularProducts face error:", error.message);
    if (error.cause) console.error("getMostPopularProducts error cause:", error.cause);
    return [];
  }
};

const getTopRatedProducts = async (): Promise<Product[]> => {
  try {
    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info').trim();
    const url = `${apiBaseUrl}/top-rated-product`;
    console.log(`Fetching top rated products from: ${url}`);
    const response = await axios.get(url);
    const data = response.data;
    const products = data.products || [];
    return products.map(transformApiProduct).filter((p: any) => p !== null);
  } catch (error: any) {
    console.error("getTopRatedProducts face error:", error.message);
    if (error.cause) console.error("getTopRatedProducts error cause:", error.cause);
    return [];
  }
};

export default {
  getBrands,
  getProducts,
  getServices,
  getCategories,
  getMainCarouselData,
  getMenFashionProducts,
  getElectronicsProducts,
  getWomenFashionProducts,
  getLatestProducts,
  getMostPopularProducts,
  getTopRatedProducts
};

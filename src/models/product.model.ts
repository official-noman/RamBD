import Shop from "./shop.model";
import Review from "./Review.model";

interface Product {
  unit?: any;
  slug: string;
  pro_slug?: string;
  model?: string;
  price: number;
  title: string;
  rating: number;
  discount: number;
  thumbnail: string;
  id: string;
  shop?: Shop;
  brand?: string;
  brandId?: string;
  regularPrice?: number;
  size?: string[];
  status?: string;
  colors?: string[];
  images?: string[];
  categories: any[];
  categoryName?: string;
  category_slug?: string;
  reviews?: Review[];
  published?: boolean;
  description?: string;
  product_code?: string;
  visitors?: number;
  on_sale?: boolean;
  in_stock?: boolean;
  featured?: boolean;
  pro_meta_key?: string;
  pro_meta_description?: string;
  meta_title?: string;
  special_keywords?: string;
  parentId?: number;
  delivery_charge?: number;
}

export default Product;

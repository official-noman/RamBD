interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  parent: string[];
  featured?: boolean;
  description?: string;
  // Metadata fields from Admin Panel
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  cat_meta_title?: string;
  cat_meta_description?: string;
  cat_meta_keys?: string;
}

export default Category;

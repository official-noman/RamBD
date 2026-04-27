import api from "@utils/__api__/products";
import RelatedProducts from "./RelatedProducts";

interface Props {
  effectiveCat?: string;
  parentId?: number | string;
}

export default async function RelatedProductsWrapper({ effectiveCat, parentId }: Props) {
  // Ensure parentId is a number if it exists, as the API expects a number
  const numericParentId = parentId ? Number(parentId) : undefined;
  
  const relatedProducts = await api.getRelatedProducts(effectiveCat, numericParentId).catch((err) => {
    console.warn("Failed to fetch related products:", err);
    return [];
  });

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return <RelatedProducts products={relatedProducts} />;
}

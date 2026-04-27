import api from "@utils/__api__/products";
import Container from "@component/Container";
import ProductView from "./ProductView";
import Product from "@models/product.model";

interface Props {
    product: Product;
    effectiveCat?: string;
}

export default async function ProductViewWrapper({ product }: Props) {
    // Fetch non-critical data
    const reviews = product.model 
        ? await api.getReviews(product.pro_slug || product.slug, product.model).catch(() => [])
        : [];

    // Attach reviews to product
    if (reviews) {
        product.reviews = reviews;
    }

    return (
        <ProductView product={product} />
    );
}

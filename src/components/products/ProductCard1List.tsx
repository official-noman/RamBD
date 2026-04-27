import FlexBox from "@component/FlexBox";
import Grid from "@component/grid/Grid";
import Pagination from "@component/pagination";
import { ProductCard1 } from "@component/product-cards";
import { SemiSpan } from "@component/Typography";
import Product from "@models/product.model";

// ==========================================================
type Props = { products: Product[]; categorySlug?: string };
// ==========================================================

export default function ProductGridView({ products, categorySlug }: Props) {
  return (
    <div>
      <Grid container spacing={1}>
        {products.map((item) => (
          <Grid item lg={3} sm={6} xs={12} key={item.id}>
            <ProductCard1
              id={item.id}
              slug={item.slug}
              price={item.price}
              title={item.title}
              off={item.discount}
              images={item.images}
              imgUrl={item.thumbnail}
              rating={item.rating || 4}
              regularPrice={item.regularPrice}
              categorySlug={categorySlug}
            />
          </Grid>
        ))}
      </Grid>

      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt="32px">
        <SemiSpan>Showing 1-9 of 1.3k Products</SemiSpan>
        <Pagination pageCount={products.length} />
      </FlexBox>
    </div>
  );
}

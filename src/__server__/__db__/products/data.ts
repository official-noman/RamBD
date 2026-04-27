import dbProducts from "@data/db";
import { products as market2 } from "../market-2/data";
import {
  relatedProducts,
  frequentlyBoughtData,
} from "../related-products/data";

// all used products in the bazaar template
const productList = [
  ...market2,
  ...relatedProducts,
  ...frequentlyBoughtData,
  ...dbProducts,
];

// get unique products from prouct list
const uniqueProductMap = new Map();
productList.forEach((product) => {
  if (!uniqueProductMap.has(product.slug)) {
    uniqueProductMap.set(product.slug, product);
  }
});
const uniqueProudcts = Array.from(uniqueProductMap.values());

// get unique products from prouct list
// const uniqueProudcts = [...new Set(productList.map((item) => item.slug))].map(
//   (item) => productList.find((it) => it.slug === item)
// );

// get the all slugs
const slugs = uniqueProudcts.map((item) => ({ params: { slug: item.slug } }));

export { uniqueProudcts, slugs };

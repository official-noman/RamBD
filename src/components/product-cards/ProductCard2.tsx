import Link from "next/link";
import HoverBox from "@component/HoverBox";
import { H4 } from "@component/Typography";
import NextImage from "@component/NextImage";
import { currency } from "@utils/utils";

import { Chip } from "@component/Chip";

// ========================================================
type ProductCard2Props = {
  slug: string;
  title: string;
  price: number;
  regularPrice?: number;
  off?: number;
  imgUrl: string;
};
// ========================================================

export default function ProductCard2({ imgUrl, title, price, regularPrice, slug, off = 0 }: ProductCard2Props) {
  return (
    <Link href={`/pro/${slug}`}>
      <HoverBox borderRadius={8} mb="0.5rem" display="flex" position="relative">
        {!!off && (
          <Chip
            top="10px"
            left="10px"
            zIndex={1}
            p="5px 10px"
            fontSize="10px"
            fontWeight="600"
            bg="primary.main"
            position="absolute"
            color="primary.text">
            {off}% off
          </Chip>
        )}
        <NextImage src={imgUrl} width={181} height={181} alt={title} />
      </HoverBox>

      <H4 fontWeight="600" fontSize="14px" mb="0.25rem">
        {title}
      </H4>

      <H4 fontWeight="600" fontSize="14px" color="primary.main">
        {currency(price)}
        {regularPrice && regularPrice > price && (
          <del style={{ color: "#7D879C", marginLeft: "8px", fontWeight: "normal" }}>
            {currency(regularPrice)}
          </del>
        )}
      </H4>
    </Link>
  );
}

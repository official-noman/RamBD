import Link from "next/link";

import Card from "@component/Card";
import FlexBox from "@component/FlexBox";
import HoverBox from "@component/HoverBox";
import NextImage from "@component/NextImage";
import { H6, SemiSpan } from "@component/Typography";
import { Chip } from "@component/Chip";
import { calculateDiscount, currency } from "@utils/utils";

// ==============================================================
type ProductCard8Props = {
  id: string;
  off: number;
  slug: string;
  price: number;
  title: string;
  imgUrl: string;
  regularPrice?: number;
  [key: string]: unknown;
};
// ==============================================================

export default function ProductCard8({
  id,
  off,
  slug,
  price,
  regularPrice,
  title,
  imgUrl,
  ...props
}: ProductCard8Props) {
  return (
    <Card p="1rem" borderRadius={8} {...props}>
      <Link href={`/pro/${slug}`}>
        <HoverBox mb="0.75rem" borderRadius={8} overflow="hidden" position="relative">
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
          <NextImage
            src={imgUrl || "/assets/images/products/Rectangle 116.png"}
            width={500}
            height={500}
            alt={title}
          />
        </HoverBox>

        <SemiSpan title={title} mb="0.25rem" color="inherit" ellipsis display="block">
          {title}
        </SemiSpan>

        <FlexBox alignItems="center">
          <H6 color="primary.main" mr="0.25rem">
            {currency(price)}
          </H6>

          <SemiSpan>
            <del>{currency(regularPrice || price)}</del>
          </SemiSpan>
        </FlexBox>
      </Link>
    </Card>
  );
}

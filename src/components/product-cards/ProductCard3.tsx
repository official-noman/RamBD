"use client";

import Image from "next/image";
import styled, { CSSProperties } from "styled-components";
import Rating from "../rating";
import Icon from "../icon/Icon";
import FlexBox from "../FlexBox";
import { Button } from "../buttons";
import { getTheme, currency } from "@utils/utils";

// STYLED COMPONENT
const Wrapper = styled.div`
  border-radius: 8px;
  display: inline-block;
  transition: all 250ms ease-in-out;
  background-color: ${getTheme("colors.body.default")};

  &:hover {
    box-shadow: ${getTheme("shadows.6")};
    .details {
      .add-cart {
        display: flex;
      }
    }
  }

  .image-holder {
    position: relative;
    text-align: center;
    display: inline-block;

    .sale-chip {
      top: 0.625rem;
      left: 0.625rem;
      color: white;
      font-size: 13px;
      position: absolute;
      border-radius: 500px;
      display: inline-block;
      padding: 0.4rem 0.78rem;
      background: ${getTheme("colors.primary.main")};
    }
  }

  .details {
    padding: 1rem;

    h4 {
      margin: 0 0 0.5rem;
      color: ${getTheme("colors.text.secondary")};
    }

    .price {
      display: flex;
      margin-top: 0.5rem;
      font-weight: 600;

      h4 {
        margin: 0px;
        padding-right: 0.5rem;
        color: ${getTheme("colors.primary.main")};
      }
      del {
        color: ${getTheme("colors.text.hint")};
      }
    }

    .icon-holder {
      display: flex;
      align-items: flex-end;
      flex-direction: column;
      justify-content: space-between;
    }

    .favorite-icon {
      cursor: pointer;
    }
    .outlined-icon {
      svg path {
        fill: ${getTheme("colors.text.hint")};
      }
    }
    .add-cart {
      display: none;
      margin-top: auto;
      align-items: center;

      span {
        font-size: 15px;
        font-weight: 600;
        padding: 0px 0.5rem;
      }
    }
  }
`;

// ========================================================
type ProductCard3Props = {
  className?: string;
  style?: CSSProperties;
  price: number;
  regularPrice?: number;
  off?: number;
  title: string;
  imgUrl: string;
  rating?: number;
  slug: string;
  id: string | number;
};
// ========================================================

export default function ProductCard3(props: ProductCard3Props) {
  const { id, slug, title, price, regularPrice, off, imgUrl, rating, className, style } = props;
  return (
    <Wrapper className={className} style={style}>
      <div className="image-holder" style={{ position: "relative", width: "100%", minHeight: "200px" }}>
        {!!off && <div className="sale-chip">{off}% off</div>}
        <Image
          src={imgUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          style={{ objectFit: "contain" }}
          loading="lazy"
        />
      </div>

      <div className="details">
        <FlexBox justifyContent="space-between">
          <div>
            <h4>{title}</h4>
          </div>

          <div className="icon-holder">
            <Icon className="favorite-icon" color="primary" variant="small">
              heart-filled
            </Icon>
          </div>
        </FlexBox>

        <FlexBox justifyContent="space-between">
          <div>
            <Rating
              outof={5}
              value={rating || 3.5}
              color="warn"
              onChange={(value) => console.log(value, "from rating")}
            />
            <div className="price">
              <h4>{currency(price)}</h4>
              {!!off && <del>{currency(regularPrice || price)}</del>}
            </div>
          </div>

          <div className="add-cart">
            <Button variant="outlined" color="primary" padding="5px">
              <Icon variant="small">minus</Icon>
            </Button>
            <span>45</span>
            <Button variant="outlined" color="primary" padding="5px">
              <Icon variant="small">plus</Icon>
            </Button>
          </div>
        </FlexBox>
      </div>
    </Wrapper>
  );
}

"use client";

import { PropsWithChildren, forwardRef } from "react";
import SlickCarousel, { Settings } from "react-slick";
import { CSSObject } from "styled-components";
// LOCAL CUSTOM COMPONENTS
import CarouselDots from "./CarouselDots";
import CarouselArrows from "./CarouselArrows";

// STYLED COMPONENT
import { RootStyle } from "./styles";

// ==============================================================
interface Props extends PropsWithChildren, Settings {
  dotColor?: string;
  spaceBetween?: number;
  dotStyles?: CSSObject;
  arrowStyles?: CSSObject;
}
// ==============================================================

const Carousel = forwardRef<SlickCarousel, Props>((props, ref) => {
  const {
    dotColor,
    children,
    arrowStyles,
    dots = false,
    arrows = true,
    slidesToShow = 4,
    spaceBetween = 10,
    dotStyles = { marginTop: "2rem" },
    ...others
  } = props;

  const settings: Settings = {
    dots,
    arrows,
    slidesToShow,
    ...CarouselArrows({ style: arrowStyles }),
    ...CarouselDots({ dotColor, style: dotStyles }),
    ...others
  };

  return (
    <RootStyle space={spaceBetween}>
      <SlickCarousel ref={ref} {...settings}>
        {children}
      </SlickCarousel>
    </RootStyle>
  );
});

export default Carousel;

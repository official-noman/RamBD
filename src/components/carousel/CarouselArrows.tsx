import { CustomArrowProps } from "react-slick";
import { CSSProperties } from "styled-components";
import Icon from "@component/icon/Icon";
import { ArrowButton } from "./styles";

// ==============================================================
interface ArrowProps extends CustomArrowProps {
  style?: CSSProperties;
}
// ==============================================================

function NextArrow({ onClick, style, className }: ArrowProps) {
  const updatedClassName = className
    .split(" ")
    .filter((item) => item !== "slick-next")
    .join(" ");

  return (
    <ArrowButton onClick={onClick} className={`next ${updatedClassName}`} style={style}>
      <Icon variant="small" defaultcolor="currentColor" className="forward-icon">
        arrow-right
      </Icon>
    </ArrowButton>
  );
}

function PrevArrow({ onClick, style, className }: ArrowProps) {
  const updatedClassName = className
    .split(" ")
    .filter((item) => item !== "slick-prev")
    .join(" ");

  return (
    <ArrowButton onClick={onClick} className={`prev ${updatedClassName}`} style={style}>
      <Icon variant="small" defaultcolor="currentColor" className="back-icon">
        arrow-left
      </Icon>
    </ArrowButton>
  );
}

export default function CarouselArrows({ style }: { style?: CSSProperties }) {
  return {
    nextArrow: <NextArrow style={style} />,
    prevArrow: <PrevArrow style={style} />
  };
}

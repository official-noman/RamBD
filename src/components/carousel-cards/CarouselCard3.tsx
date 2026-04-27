import Image from "next/image";
import styled from "styled-components";
// GLOBAL CUSTOM COMPONENTS
import { Button } from "@component/buttons";
import { H1, H4, Paragraph, Span } from "@component/Typography";
// UTILS
import { deviceSize } from "@utils/constants";

// STYLED COMPONENTS
const CarouselCard = styled.div`
  min-height: 500px;
  display: flex;
  align-items: center;
  background-color: #fff;
  position: relative;
  overflow: hidden;

  @media (max-width: ${deviceSize.sm}px) {
    min-height: 200px;
    padding: 24px;
  }

  @media (max-width: ${deviceSize.xs}px) {
    min-height: 120px;
  }

  @media (min-width: ${deviceSize.sm}px) {
    & .hero-content {
      padding-left: 5rem;
    }
  }
`;

// =============================================================
interface Props {
  img: string;
  title: string;
  category: string;
  discount: number;
  buttonText: string;
  description: string;
  priority?: boolean;
}
// =============================================================

export default function CarouselCard3(props: Props) {
  const { img, title, category, discount, description, buttonText, priority } = props;

  // Fallback image if URL is empty
  const imgSrc = img && img.trim() !== "" ? img : "/assets/images/banners/banner-1.png";

  return (
    <CarouselCard>
      <Image
        src={imgSrc}
        fill
        priority={priority}
        alt={category || title || "Hero Image"}
        style={{ objectFit: "cover", zIndex: 0 }}
      />
    </CarouselCard>
  );
}

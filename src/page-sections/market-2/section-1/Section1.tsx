import Grid from "@component/grid/Grid";
import NavLink from "@component/nav-link";
import Container from "@component/Container";
import { Carousel } from "@component/carousel";
import { BannerCard3 } from "@component/banners";
import { H4, Paragraph } from "@component/Typography";
import { CarouselCard3 } from "@component/carousel-cards";
// STYLED COMPONENTS
import { CardWrapper, CarouselBox } from "./styles";
// API FUNCTIONS
import api from "@utils/__api__/market-2";

export default async function Section1() {
  const carouselData = await api.getMainCarouselData();

  return (
    <Container pt="0">
      <Grid container spacing={5}>
        <Grid item lg={12} xs={12}>
          <CarouselBox>
            <Carousel
              dots
              autoplay
              arrows={false}
              spaceBetween={0}
              slidesToShow={1}
              dotStyles={{ bottom: 20 }}>
              {carouselData.map((item, index) => (
                <CarouselCard3
                  key={index}
                  img={item.imgUrl}
                  title={item.title}
                  category={item.category}
                  discount={item.discount}
                  buttonText={item.buttonText}
                  description={item.description}
                  priority={index === 0}
                />
              ))}
            </Carousel>
          </CarouselBox>
        </Grid>
      </Grid>
    </Container>
  );
}

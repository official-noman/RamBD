import api from "@utils/__api__/market-2";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Image from "@component/Image";
import FlexBox from "@component/FlexBox";
import { H1, H3 } from "@component/Typography";
import Container from "@component/Container";

export default async function BrandsPage() {
    const brands = await api.getBrands();

    return (
        <Container my="2rem">
            {/* PAGE HEADER */}
            <Box mb="2rem" textAlign="center">
                <H1 mb="0.5rem">All Brands</H1>
                <H3 fontWeight="400" color="text.muted">
                    Explore all the available products of world-renowned brands
                </H3>
            </Box>

            {/* BRANDS GRID */}
            <Grid container spacing={6}>
                {brands.map((brand) => (
                    <Grid item lg={2} md={3} sm={4} xs={6} key={brand.id}>
                        <Box
                            bg="white"
                            p="1.5rem"
                            borderRadius={8}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            height="120px"
                            className="brand-card"
                            style={{
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                border: "1px solid #f3f5f9"
                            }}
                        >
                            <FlexBox
                                width="100%"
                                height="100%"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Image
                                    src={brand.image}
                                    alt={brand.name}
                                    width="100%"
                                    style={{
                                        maxWidth: "100px",
                                        maxHeight: "80px",
                                        objectFit: "contain"
                                    }}
                                />
                            </FlexBox>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* EMPTY STATE */}
            {brands.length === 0 && (
                <Box textAlign="center" py="4rem">
                    <H3 color="text.muted">No brands available at the moment</H3>
                </Box>
            )}
        </Container>
    );
}

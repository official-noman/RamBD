import Link from "next/link";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Container from "@component/Container";
import NextImage from "@component/NextImage";
import { H4, Paragraph, Span } from "@component/Typography";
// STYLED COMPONENTS
import { CategoryCard, CategoryTitle, AnimatedText, AddButton } from "./styles";
// API FUNCTIONS
import api from "@utils/__api__/market-2";

export default async function Section3() {
  const categories = await api.getCategories();

  return (
    <Container pt="0px">
      <Grid container spacing={0.5}>
        {(categories || []).map((item) => (
          <Grid item lg={1.2} md={2} sm={3} xs={4} key={item.id}>
            <Link href={`/category/${item.slug}`}>
              <CategoryCard style={{
                height: "100px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#fff",
                border: "1px solid #eee"
              }}>
                <Box mb="5px" display="flex" justifyContent="center">
                  <i className={item.icon} style={{ fontSize: "2.5rem", color: "#e3364e" }}></i>
                </Box>

                <H4 fontSize={13} textAlign="center" color="text.primary" fontWeight="600" style={{ lineHeight: 1.2 }}>
                  {item.name}
                </H4>
              </CategoryCard>
            </Link>
          </Grid>
        ))}

        <Grid item xs={12}>
          {/* <Box style={{ backgroundColor: "#434343", position: "relative", overflow: "hidden", color: "#fff", display: "flex", alignItems: "center", marginTop: "1rem", borderRadius: "8px", border: "1px solid #555" }}>
            <Box style={{ zIndex: 10, fontSize: 18, padding: "12px 24px", position: "relative", backgroundColor: "#e0e0e0", color: "#000", fontWeight: "bold", minWidth: "fit-content", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "4px solid #e3364e", textTransform: "uppercase" }}>
              NOTICE
            </Box>

            <Paragraph ellipsis fontSize={16} flex={1} style={{ zIndex: 5, padding: "0 1rem", overflow: "hidden" }}>
              <AnimatedText>
                এই সাইটটির কাজ চলমান সাময়িক ত্রুটির জন্য দুঃখিত। এক্সপিরিয়েন্স রিলেটেড কোনো ইস্যুর জন্য হেল্প লাইনে যোগাযোগ করুন ০১৯৫৮৬৬৬৯৯৯।
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Maintenance work is currently ongoing. Sorry for the temporary inconvenience. For any experience-related issues, please contact our helpline at 01958666999.
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Helpline: 01958666999
              </AnimatedText>
            </Paragraph>

            <Box padding="1rem" flexShrink={0} zIndex={5}>
              <Link href="tel:01958666999">
                <AddButton variant="contained" color="primary" style={{ padding: '8px 20px' }}>
                  Call Now
                </AddButton>
              </Link>
            </Box>
          </Box> */}
        </Grid>
      </Grid>
    </Container>
  );
}

import Link from "next/link";
import Image from "next/image";
import market2Api from "@utils/__api__/market-2";
import Box from "@component/Box";
import { H4, Paragraph, Span } from "@component/Typography";
import { currency } from "@utils/utils";
import { theme } from "@utils/theme";

export default async function LatestProductsSidebar() {
    const latestProducts = await market2Api.getProducts();

    return (
        <Box width="220px" flexShrink={0}>
            <Box bg="white" p="8px" borderRadius={8} shadow={1} textAlign="center" height="100%">
                <H4 fontSize={11} mb="12px" color="text.muted" style={{ lineHeight: 1.2 }}>Latest Products</H4>

                <Box>
                    {latestProducts?.slice(0, 5).map((item) => (
                        <Link href={`/pro/${item.slug}`} key={item.id}>
                            <Box
                                padding="8px 4px"
                                mb="10px"
                                style={{ border: "1px solid", borderColor: theme.colors.gray[200], borderRadius: 8 }}
                            >
                                <Box mb="5px" display="flex" justifyContent="center">
                                    <Image
                                        width={180}
                                        height={180}
                                        alt={item.title}
                                        src={item.thumbnail}
                                        style={{ objectFit: "contain", borderRadius: 4 }}
                                    />
                                </Box>

                                <Paragraph fontSize={11} color="primary.main" fontWeight="700">
                                    {currency(item.price)}
                                </Paragraph>
                            </Box>
                        </Link>
                    ))}
                </Box>

                <Link href="/#latest-products">
                    <Box color="success.main" cursor="pointer" mt="10px">
                        <Span fontWeight="600" fontSize={10}>See All</Span>
                    </Box>
                </Link>
            </Box>
        </Box>
    );
}

"use client";

import { useEffect, useState } from "react";
import Box from "@component/Box";
import Container from "@component/Container";
import Typography, { H1, H3, Paragraph } from "@component/Typography";
import { Button } from "@component/buttons";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info";

export default function TermsAndConditionsPage() {
    const router = useRouter();
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            // Try multiple possible endpoints
            const endpoints = [
                `${API_BASE}/api/terms-conditions`,
                `${API_BASE}/api/terms-and-conditions`,
                `${API_BASE}/api/terms`,
            ];

            for (const url of endpoints) {
                try {
                    const res = await fetch(url, {
                        headers: { Accept: "application/json" }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        const html =
                            data.data?.content ||
                            data.content ||
                            data.terms ||
                            data.terms_and_conditions ||
                            data.data?.terms ||
                            "";
                        if (html) {
                            setContent(html);
                            break;
                        }
                    }
                } catch (e) {
                    // try next endpoint
                }
            }
            setLoading(false);
        };
        fetchContent();
    }, []);

    return (
        <Container mb="4rem" mt="2rem" maxWidth="860px">
            <Box mb="1.5rem">
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => router.back()}
                    style={{ fontWeight: 600 }}
                >
                    ← Back
                </Button>
            </Box>

            <H1 mb="0.5rem" fontSize="28px" fontWeight="800" color="text.primary">
                Terms &amp; Conditions
            </H1>
            <Box mb="2rem" height="3px" width="60px" bg="primary.main" borderRadius="4px" />

            {loading ? (
                <Box py="4rem" textAlign="center">
                    <Typography color="text.muted">Loading...</Typography>
                </Box>
            ) : content ? (
                <Box
                    p="2rem"
                    bg="white"
                    borderRadius="12px"
                    style={{
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        lineHeight: 1.8,
                        fontSize: "15px",
                        color: "#333"
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            ) : (
                <Box p="3rem" bg="white" borderRadius="12px" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                    <H3 mb="1rem">Terms &amp; Conditions</H3>
                    <Paragraph color="text.muted" mb="1rem">
                        By using our website and placing orders, you agree to our terms and conditions. Please read the following carefully.
                    </Paragraph>
                    <Paragraph color="text.muted" mb="1rem">
                        1. All orders are subject to product availability and payment verification.
                    </Paragraph>
                    <Paragraph color="text.muted" mb="1rem">
                        2. We reserve the right to cancel any order at our discretion.
                    </Paragraph>
                    <Paragraph color="text.muted" mb="1rem">
                        3. Prices are subject to change without prior notice.
                    </Paragraph>
                    <Paragraph color="text.muted" mb="1rem">
                        4. Delivery timelines are estimates and may vary based on location and availability.
                    </Paragraph>
                    <Paragraph color="text.muted">
                        For any queries, please contact our support team.
                    </Paragraph>
                </Box>
            )}
        </Container>
    );
}

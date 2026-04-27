"use client";

import { useEffect, useState } from "react";
import Box from "@component/Box";
import Container from "@component/Container";
import Typography, { H1, H3, Paragraph } from "@component/Typography";
import { Button } from "@component/buttons";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info";

export default function PrivacyPolicyPage() {
    const router = useRouter();
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            // Try multiple possible endpoints
            const endpoints = [
                `${API_BASE}/api/privacy-policy`,
                `${API_BASE}/api/privacy-and-policy`,
                `${API_BASE}/api/privacy`,
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
                            data.privacy ||
                            data.privacy_policy ||
                            data.data?.privacy ||
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
                Privacy Policy
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
                    <H3 mb="1rem">Privacy Policy</H3>
                    <Paragraph color="text.muted" mb="1rem">
                        We value your privacy and are committed to protecting your personal information.
                    </Paragraph>
                    <Paragraph color="text.muted" mb="1rem">
                        1. We collect personal information such as name, phone number, and delivery address solely to process your orders.
                    </Paragraph>
                    <Paragraph color="text.muted" mb="1rem">
                        2. We do not sell, trade, or share your personal information with third parties without your consent.
                    </Paragraph>
                    <Paragraph color="text.muted" mb="1rem">
                        3. Your data is stored securely and we take all reasonable measures to protect it from unauthorized access.
                    </Paragraph>
                    <Paragraph color="text.muted">
                        For any privacy-related concerns, please contact our support team.
                    </Paragraph>
                </Box>
            )}
        </Container>
    );
}

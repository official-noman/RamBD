"use client";

import { useEffect, useState } from "react";
import Box from "@component/Box";
import Container from "@component/Container";
import Typography, { H1, H3, Paragraph } from "@component/Typography";
import { Button } from "@component/buttons";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info";

export default function RefundPolicyPage() {
    const router = useRouter();
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/refund-policy`, {
                    headers: { Accept: "application/json" }
                });
                if (res.ok) {
                    const data = await res.json();
                    const html =
                        data.content ||
                        data.refund ||
                        data.data?.content ||
                        data.refund_policy ||
                        "";
                    setContent(html);
                }
            } catch (e) {
                console.error("Failed to fetch refund policy:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    return (
        <Container mb="4rem" mt="2rem" maxWidth="860px">
            {/* Back button */}
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
                Refund Policy
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
                    <H3 mb="1rem">Refund Policy</H3>
                    <Paragraph color="text.muted" mb="1rem">
                        We are committed to ensuring your satisfaction with every purchase. Please read our refund policy carefully before placing an order.
                    </Paragraph>
                    <Paragraph color="text.muted" mb="1rem">
                        1. Refund requests must be made within 7 days of receiving the product.
                    </Paragraph>
                    <Paragraph color="text.muted" mb="1rem">
                        2. Products must be returned in their original, unused condition with all original packaging and accessories.
                    </Paragraph>
                    <Paragraph color="text.muted" mb="1rem">
                        3. Refunds will be processed within 5-7 business days after the returned product is received and inspected.
                    </Paragraph>
                    <Paragraph color="text.muted" mb="1rem">
                        4. Shipping charges are non-refundable unless the return is due to a defective or incorrect product.
                    </Paragraph>
                    <Paragraph color="text.muted" mb="1rem">
                        5. Products damaged due to misuse or negligence will not be eligible for a refund.
                    </Paragraph>
                    <Paragraph color="text.muted">
                        To initiate a return or refund, please contact our support team with your order ID.
                    </Paragraph>
                </Box>
            )}
        </Container>
    );
}

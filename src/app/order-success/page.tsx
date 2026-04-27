"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Box from "@component/Box";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Typography, { H1, Paragraph, Tiny } from "@component/Typography";
import Icon from "@component/icon/Icon";
import api from "@utils/__api__/orders";
import checkoutApi from "@utils/__api__/checkout";
import Order from "@models/order.model";
import Invoice from "@component/invoice/Invoice";

// Dynamically import html2pdf to avoid SSR issues if necessary, 
// though we'll use it inside a useEffect/client-side handler.
let html2pdf: any;
if (typeof window !== "undefined") {
    html2pdf = require("html2pdf.js");
}

// STYLED COMPONENTS
const StyledCard = styled(Card)`
  padding: 3rem;
  text-align: center;
  max-width: 600px;
  margin: auto;
  border-radius: 12px;
`;

const InvoiceWrapper = styled(Box)`
  display: none;
  @media print {
    display: block;
  }
`;

const ViewInvoiceModal = styled(Box) <{ open: boolean }>`
  display: ${props => (props.open ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  overflow-y: auto;
  padding: 40px 20px;
`;

const ModalContent = styled(Card)`
  max-width: 900px;
  margin: auto;
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 8px;
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export default function OrderSuccess({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Support query param for testing: ?login=true
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [districts, setDistricts] = useState<any[]>([]);
    const [thanas, setThanas] = useState<any[]>([]);

    useEffect(() => {
        // Check for login query param
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            if (params.get("login") === "true") {
                setIsLoggedIn(true);
            }
        }

        // Fetch districts and thanas for lookup
        const fetchLocations = async () => {
            const data = await checkoutApi.getDistrictsAndThanas();
            if (data && Array.isArray(data.district)) {
                setDistricts(data.district || []);
                setThanas(data.thana || []);
            }
        };
        fetchLocations();

        const fetchOrder = async () => {
            try {
                // First, check if we have a fresh order response from sessionStorage
                const lastOrderDataStr = sessionStorage.getItem("lastOrderData");
                console.log("🔍 Checking sessionStorage for lastOrderData:", lastOrderDataStr);
                if (lastOrderDataStr) {
                    try {
                        const orderData = JSON.parse(lastOrderDataStr);

                        // Helper function to get district name from ID
                        const getDistrictName = (id: any) => {
                            if (!id) return "";
                            const district = districts.find(d => d.id == id);
                            return district ? district.district : id.toString();
                        };

                        // Helper function to get thana name from ID
                        const getThanaName = (id: any) => {
                            if (!id) return "";
                            const thana = thanas.find(t => t.id == id);
                            return thana ? thana.thana : id.toString();
                        };

                        // Transform the API response to match our Order model
                        // Try to get original prices if available in form_data
                        const sourceProducts = orderData.form_data?.products || orderData.products || [];
                        const products = sourceProducts.map((p: any) => ({
                            product_name: p.product_title || p.product_name || p.name || "Product",
                            product_price: parseFloat(p.original_price || p.calculated_price || p.product_price || p.sale_price || 0),
                            product_quantity: p.quantity || p.product_qty || 1,
                            product_img: p.product_img || p.imgUrl || ""
                        }));

                        // Calculate total price from products (Gross Total)
                        const productsTotal = products.reduce((sum: number, p: any) =>
                            sum + (p.product_price * p.product_quantity), 0
                        );

                        // Extract shipping cost with multiple fallbacks
                        const shippingCost = parseFloat(
                            orderData.form_data?.shipping_cost ||
                            orderData.shipping_cost ||
                            orderData.order_details?.shipping_cost ||
                            0
                        );

                        // Use stored discount if available
                        const discount = parseFloat(orderData.form_data?.total_discount || orderData.discount || 0);

                        const transformedOrder: Order = {
                            id: orderData.order_id || orderData.id,
                            createdAt: new Date(),
                            totalPrice: productsTotal,
                            discount: discount,
                            shippingAddress: orderData.form_data?.address || orderData.shipping_address || "N/A",
                            district: orderData.form_data?.district_name || getDistrictName(orderData.form_data?.district_id || orderData.district_id),
                            thana: orderData.form_data?.thana_name || getThanaName(orderData.form_data?.thana_id || orderData.thana_id),
                            shippingCost: shippingCost,
                            specialNote: orderData.form_data?.special_note || "",
                            paymentMethod: orderData.form_data?.payment_method || "Cash On Delivery",
                            items: products,
                            status: "Processing",
                            isDelivered: false,
                            deliveredAt: new Date(),
                            tax: 0,
                            user: {
                                name: {
                                    firstName: orderData.form_data?.customer_name || orderData.customer_name || "Customer",
                                    lastName: ""
                                },
                                phone: orderData.form_data?.phone || orderData.phone || "N/A"
                            } as any
                        };
                        console.log("📦 Raw orderData from sessionStorage/API:", orderData);
                        console.log("💰 Products Total (Gross):", productsTotal);
                        console.log("🚚 Shipping:", shippingCost);
                        console.log("🎁 Discount:", discount);
                        console.log("✅ Transformed order data:", transformedOrder);
                        setOrder(transformedOrder);
                        // Clear the sessionStorage after a short delay to avoid React double-render issues
                        setTimeout(() => {
                            sessionStorage.removeItem("lastOrderData");
                        }, 1000);
                        setLoading(false);
                        return;
                    } catch (e) {
                        console.error("Failed to parse lastOrderData:", e);
                    }
                }

                // Fallback to fetching from API
                const orders = await api.getOrders();
                if (orders && orders.length > 0) {
                    setOrder(orders[0]);
                } else {
                    // Only use dummy if absolutely NO orders exist in the system
                    setOrder({
                        id: "RB260131002",
                        createdAt: new Date(),
                        totalPrice: 1450,
                        discount: 0,
                        shippingAddress: "Sample Address",
                        items: [{
                            product_name: "Demo Product Name",
                            product_price: 1450,
                            product_quantity: 1,
                            product_img: ""
                        }],
                        status: "Processing",
                        isDelivered: false,
                        deliveredAt: new Date(),
                        tax: 0,
                        user: { name: { firstName: "Customer", lastName: "" }, phone: "017XXXXXXXX" } as any
                    });
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, []);

    const handleDownload = () => {
        if (!order) return;

        const element = document.getElementById("invoice-to-pdf");
        if (!element || !html2pdf) {
            window.print(); // Fallback to standard print
            return;
        }

        const opt = {
            margin: [8, 8, 8, 8],
            filename: `invoice-RB${order.id.substring(0, 10).toUpperCase()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // New Promise-based usage:
        html2pdf().set(opt).from(element).save();
    };

    if (loading) return <Box textAlign="center" p="40px">Loading...</Box>;


    return (
        <Box py="4rem">
            {/* Thank You Section */}
            <Box textAlign="center" mb="3rem" className="hide-from-print">
                <Box color="success.main" fontSize="80px">
                    <Icon size="80px">
                        check_circle
                    </Icon>
                </Box>
                <H1 mt="1rem" color="success.main">
                    Thank You {order.user?.name?.firstName || "Customer"} for Your Order!
                </H1>
                <Paragraph fontSize="18px" color="text.muted" mt="0.5rem">
                    Your order has been successfully placed. Order ID: <strong>{order.id.toString().startsWith("RB") ? order.id : `RB${order.id.toString().toUpperCase()}`}</strong>
                </Paragraph>
                <Paragraph fontSize="16px" color="text.muted" mt="0.5rem">
                    We'll send you a confirmation shortly.
                </Paragraph>
            </Box>

            <Box id="invoice-to-pdf">
                <Invoice order={order} />
            </Box>
            <FlexBox justifyContent="center" flexWrap="wrap" gridGap="1rem" mt="2rem" mb="4rem" className="hide-from-print">
                {/* Logged-in user sees both View and Download */}
                {(isLoggedIn) && (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setIsViewOpen(true)}
                    >
                        View Invoice
                    </Button>
                )}

                <Link href="/">
                    <Button variant="outlined" color="primary" px="30px">
                        Back to Home
                    </Button>
                </Link>

                {/* Guest and Logged-in users see Download Invoice */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownload}
                    px="30px"
                >
                    Download Invoice
                </Button>
            </FlexBox>

            {/* Developer Alert for testing */}
            {!isLoggedIn && (
                <Tiny color="text.muted" mt="20px" display="block" className="hide-from-print">
                    Tip: Add <strong>?login=true</strong> to the URL to test the "View Invoice" button.
                </Tiny>
            )}

            {/* View Invoice Modal */}
            <ViewInvoiceModal open={isViewOpen} className="hide-from-print">
                <ModalContent>
                    <CloseButton
                        variant="text"
                        color="primary"
                        onClick={() => setIsViewOpen(false)}
                    >
                        ✕
                    </CloseButton>
                    {order && <Invoice order={order} />}
                    <Box textAlign="center" mt="2rem">
                        <Button variant="contained" color="primary" onClick={handleDownload}>
                            Download PDF
                        </Button>
                    </Box>
                </ModalContent>
            </ViewInvoiceModal>
        </Box>
    );
}

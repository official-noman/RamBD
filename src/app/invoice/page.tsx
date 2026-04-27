"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Box from "@component/Box";
import api from "@utils/__api__/orders";
import Order from "@models/order.model";
import Invoice from "@component/invoice/Invoice";

function InvoiceContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "latest";
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orders = await api.getOrders();
                const found = orders.find(o => o.id.includes(id) || id === "latest");
                if (found) {
                    setOrder(found);
                } else if (orders.length > 0) {
                    setOrder(orders[0]); // Fallback to first
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <Box textAlign="center" p="40px">Loading Invoice...</Box>;
    if (!order) return <Box textAlign="center" p="40px">Invoice not found.</Box>;

    return (
        <Box py="20px">
            <Invoice order={order} />
        </Box>
    );
}

export default function InvoicePage() {
    return (
        <Suspense fallback={<Box textAlign="center" p="40px">Loading...</Box>}>
            <InvoiceContent />
        </Suspense>
    );
}

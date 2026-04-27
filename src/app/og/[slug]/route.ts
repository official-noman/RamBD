import { NextRequest, NextResponse } from "next/server";
import api from "@utils/__api__/products";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const product = await api.getProduct(slug);

        if (!product || !product.images || product.images.length === 0) {
            return NextResponse.redirect(new URL("/assets/images/rambd_logo.webp", request.url));
        }

        // Redirect to the first product image
        const imageUrl = product.images[0];

        // If it's a relative URL, prepend the base URL
        if (imageUrl.startsWith("/")) {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            return NextResponse.redirect(new URL(imageUrl, baseUrl));
        }

        return NextResponse.redirect(new URL(imageUrl));
    } catch (error) {
        console.error("OG Image Route Error:", error);
        return NextResponse.redirect(new URL("/assets/images/rambd_logo.webp", request.url));
    }
}

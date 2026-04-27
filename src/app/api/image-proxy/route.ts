import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

// Runtime must be nodejs for sharp and fs
export const runtime = "nodejs";

const baseHost = (() => {
    try {
        return new URL(process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").hostname;
    } catch {
        return "admin.unicodeconverter.info";
    }
})();

// Allowed external hostnames (security whitelist)
const ALLOWED_HOSTS = [
    baseHost,
    "admin.unicodeconverter.info",
    "rambd.com",
];

// Cache directory
const CACHE_DIR = path.join(process.cwd(), ".next", "cache", "image-proxy");

async function ensureCacheDir() {
    try {
        await fs.mkdir(CACHE_DIR, { recursive: true });
    } catch (err) {
        console.warn("[image-proxy] Could not create cache directory:", err);
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const width = parseInt(searchParams.get("w") || "800", 10);
    const quality = parseInt(searchParams.get("q") || "75", 10);

    if (!url) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    // Security: only allow whitelisted hosts
    let parsedUrl: URL;
    try {
        parsedUrl = new URL(url);
    } catch {
        return new NextResponse("Invalid url", { status: 400 });
    }

    if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
        return new NextResponse("Host not allowed", { status: 403 });
    }

    try {
        await ensureCacheDir();

        // 1. Detect format support from Accept header
        const acceptHeader = request.headers.get("accept") || "";
        const prefersAvif = acceptHeader.includes("image/avif");
        const format = prefersAvif ? "avif" : "webp";

        // 2. Generate Cache Key
        const cacheKey = crypto
            .createHash("md5")
            .update(`${url}-${width}-${quality}-${format}`)
            .digest("hex");
        const cacheFilePath = path.join(CACHE_DIR, `${cacheKey}.${format}`);

        // 3. Check Cache
        try {
            const cachedData = await fs.readFile(cacheFilePath);
            return new NextResponse(new Uint8Array(cachedData), {
                status: 200,
                headers: {
                    "Content-Type": `image/${format}`,
                    "Cache-Control": "public, max-age=31536000, immutable",
                    "Vary": "Accept",
                    "X-Image-Cache": "HIT",
                },
            });
        } catch {
            // Cache miss, proceed to fetch and process
        }

        try {
            // Fetch with browser-like headers so PHP backend doesn't block
            const res = await fetch(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    Referer: "https://rambd.com/",
                    "Cache-Control": "no-cache",
                },
                signal: AbortSignal.timeout(10000),
            });

            if (!res.ok) {
                console.warn(`[image-proxy] Upstream fetch failed for ${url}: ${res.status} — redirecting to original`);
                return NextResponse.redirect(url, { status: 302 });
            }

            const contentType = res.headers.get("content-type") || "";
            if (!contentType.startsWith("image/")) {
                console.warn(`[image-proxy] Non-image content-type for ${url}: ${contentType} — redirecting to original`);
                return NextResponse.redirect(url, { status: 302 });
            }

            const originalBuffer = Buffer.from(await res.arrayBuffer());

            // 4. Optimization Pipeline with Fallback
            let finalBuffer: Buffer = originalBuffer;
            let finalContentType = contentType;
            let isOptimized = false;

            try {
                // Use dynamic import for sharp to avoid loading errors if module is missing
                const sharpModule = await import("sharp");
                const sharp = (sharpModule.default || sharpModule) as any;

                let transformer = sharp(originalBuffer)
                    .rotate()
                    .resize(width, undefined, {
                        withoutEnlargement: true,
                        fit: "inside",
                    });

                if (prefersAvif) {
                    finalBuffer = await transformer
                        .avif({
                            quality: Math.max(quality - 15, 40),
                            effort: 4
                        })
                        .toBuffer();
                    finalContentType = "image/avif";
                } else {
                    finalBuffer = await transformer
                        .webp({
                            quality: Math.max(quality - 5, 50),
                            effort: 6
                        })
                        .toBuffer();
                    finalContentType = "image/webp";
                }
                isOptimized = true;
            } catch (sharpError) {
                console.warn("[image-proxy] Sharp failed, serving original:", (sharpError as Error).message);
                finalBuffer = originalBuffer;
                finalContentType = contentType;
                isOptimized = false;
            }

            // 5. Save to Cache (Fire and forget)
            if (isOptimized) {
                fs.writeFile(cacheFilePath, finalBuffer).catch(err =>
                    console.error("[image-proxy] Cache write error:", err)
                );
            }

            return new NextResponse(new Uint8Array(finalBuffer), {
                status: 200,
                headers: {
                    "Content-Type": finalContentType,
                    "Cache-Control": "public, max-age=31536000, immutable",
                    "Vary": "Accept",
                    "X-Image-Cache": "MISS",
                    "X-Image-Optimized": isOptimized.toString(),
                },
            });
        } catch (error) {
            // Last-resort: redirect to original URL rather than showing a broken image
            console.warn("[image-proxy] Fetch/process error, redirecting to original:", url, error);
            return NextResponse.redirect(url, { status: 302 });
        }
    } catch (globalError) {
        console.error("[image-proxy] Critical Error:", globalError);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

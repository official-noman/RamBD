// Custom Next.js image loader
// Routes external images through /api/image-proxy for optimization
// Local/relative images are passed through unchanged

const baseHost = (() => {
    try {
        return new URL(process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info").hostname;
    } catch {
        return "admin.unicodeconverter.info";
    }
})();

const EXTERNAL_HOSTS = [
    baseHost,
    "admin.unicodeconverter.info",
    "rambd.com",
];

interface ImageLoaderProps {
    src: string;
    width: number;
    quality?: number;
}

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
    // If it's a relative/local path, return as-is
    if (!src.startsWith("http://") && !src.startsWith("https://")) {
        return src;
    }

    // Check if it's an external host we should proxy
    try {
        const url = new URL(src);
        if (EXTERNAL_HOSTS.includes(url.hostname)) {
            return `/api/image-proxy?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
        }
    } catch {
        // Invalid URL, return as-is
    }

    return src;
}

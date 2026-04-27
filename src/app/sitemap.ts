import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://felna-tech.com";

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info";
    // 1. Fetch Categories
    let categoryEntries: MetadataRoute.Sitemap = [];
    try {
        const catRes = await fetch(`${apiBaseUrl}/home-menu`);
        const catData = await catRes.json();

        const childMap: Record<string | number, any[]> = {};
        if (Array.isArray(catData.subCategory)) {
            catData.subCategory.forEach((sub: any) => {
                if (sub.parent_id) {
                    if (!childMap[sub.parent_id]) childMap[sub.parent_id] = [];
                    childMap[sub.parent_id].push(sub);
                }
            });
        }

        const mapCategories = (cats: any[], parentPath = ""): MetadataRoute.Sitemap => {
            let entries: MetadataRoute.Sitemap = [];
            cats.forEach((cat: any) => {
                const slug = cat.cate_slug || cat.slug;
                if (!slug) return;

                const currentPath = parentPath ? `${parentPath}/${slug}` : slug;
                entries.push({
                    url: `${baseUrl}/category/${currentPath}`,
                    lastModified: new Date(),
                    changeFrequency: "weekly",
                    priority: parentPath ? 0.6 : 0.8,
                });

                // Find children: either from the category object itself or the childMap
                const children = cat.sub_categories || cat.category_sub_categories || cat.children || childMap[cat.id];
                if (children && children.length > 0) {
                    entries = [...entries, ...mapCategories(children, currentPath)];
                }
            });
            return entries;
        };

        const mainCategories = (catData.menu || [])
            .filter((m: any) => Number(m.checked) === 1)
            .map((m: any) => m.category);

        categoryEntries = mapCategories(mainCategories);

    } catch (error) {
        console.error("Sitemap category fetch failed:", error);
    }

    // 2. Fetch Products (Latest, Popular, Top Rated)
    let productEntries: MetadataRoute.Sitemap = [];
    try {
        const [latest, popular, topRated] = await Promise.all([
            fetch(`${apiBaseUrl}/LatestProductList/getAllLatestProducts`).then(res => res.json()),
            fetch(`${apiBaseUrl}/most-popular-product`).then(res => res.json()),
            fetch(`${apiBaseUrl}/top-rated-product`).then(res => res.json()),
        ]);

        const allProducts = [
            ...(latest.products || []),
            ...(popular.populars || []),
            ...(topRated.products || []),
        ];

        // Remove duplicates by slug
        const uniqueProducts = allProducts.reduce((acc: any[], curr: any) => {
            if (!acc.find(p => p.slug === curr.slug)) {
                acc.push(curr);
            }
            return acc;
        }, []);

        productEntries = uniqueProducts.map((prod: any) => ({
            url: `${baseUrl}/pro/${prod.slug}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.7,
        }));
    } catch (error) {
        console.error("Sitemap product fetch failed:", error);
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        ...categoryEntries,
        ...productEntries,
    ];
}

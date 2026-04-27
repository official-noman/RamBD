// Helper function to transform API product data to Product model
export const transformApiProduct = (apiProduct: any): any => {
    if (!apiProduct) return null; // Safety check

    const firstImage = apiProduct.images && apiProduct.images.length > 0
        ? apiProduct.images[0].img_name
        : '';

    const storageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL || 'https://admin.unicodeconverter.info/storage/app/public/products';

    const imageUrl = firstImage
        ? `${storageBaseUrl}/${firstImage}`
        : '/assets/images/products/default-product.png';

    const allImages = apiProduct.images?.map((img: any) =>
        `${storageBaseUrl}/${img.img_name}`
    ) || [];

    // Safety: ensure title is a string for slug generation
    const rawTitle = apiProduct.pro_title ? String(apiProduct.pro_title) : '';
    const generatedSlug = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const description = apiProduct.product_description || '';

    // Regex to extract data from description if it follows Felna Tech pattern
    const extractField = (fieldName: string) => {
        const regex = new RegExp(`<p>${fieldName}:\\s*(.*?)</p>`, 'i');
        const match = description.match(regex);
        return match ? match[1].trim() : null;
    };

    const parsedBrand = extractField('Brand');
    const parsedCategory = extractField('Category');
    const parsedModel = extractField('Model');
    const parsedCode = extractField('Code');




    const originalPrice = parseFloat(apiProduct.pro_price) || 0;
    const discountAmount = (apiProduct.pro_discount && apiProduct.pro_discount !== '0')
        ? parseFloat(apiProduct.pro_discount)
        : 0;

    // Price = Final selling price (Original - Discount Amount)
    const finalPrice = originalPrice - discountAmount;

    // Determine if product is on offer (discount amount > 0 or offer_status is 1)
    const offerStatus = discountAmount > 0 || apiProduct.offer_status === 1;

    // Calculate percentage based on saving (e.g., Discount Amount / Original)
    const discountPercentage = (offerStatus && originalPrice > 0)
        ? Math.round((discountAmount / originalPrice) * 100)
        : 0;

    const categorySlug = apiProduct.category?.cate_slug || (parsedCategory ? parsedCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '');
    const categoryName = apiProduct.category?.cate_name || parsedCategory || '';

    return {
        id: String(apiProduct.id),
        slug: generatedSlug || apiProduct.pro_slug || '',
        pro_slug: apiProduct.pro_slug,
        model: parsedModel || apiProduct.pro_model || apiProduct.model || '',
        title: rawTitle,
        price: finalPrice, // Corrected: This is now the actual selling price
        regularPrice: originalPrice, // New field: Original price for display
        discount: discountPercentage, // Changed: Now returns PERCENTAGE for badges (e.g., 20)

        thumbnail: imageUrl,
        images: allImages.reverse(), // User mentioned order is flipped
        rating: parseFloat(apiProduct.rating) || parseFloat(apiProduct.avg_rating) || 4.5,
        categories: categorySlug ? [categorySlug] : [],
        categoryName: categoryName,
        category_slug: categorySlug,
        reviews: [],
        description: description,
        brand: parsedBrand || 'Felna Tech',
        brandId: apiProduct.brand_id ? String(apiProduct.brand_id) : undefined,
        product_code: parsedCode || apiProduct.pro_code || String(apiProduct.id),
        status: apiProduct.pro_status === 1 ? 'Yes' : 'Out of Stock',
        in_stock: apiProduct.pro_status === 1 || (apiProduct.total_stock && Number(apiProduct.total_stock) > 0),
        on_sale: offerStatus,
        featured: apiProduct.featured === 1 || apiProduct.is_featured === 1,
        visitors: apiProduct.visitors || 0,
        pro_meta_key: apiProduct.pro_meta_key || '',
        special_keywords: apiProduct.special_keywords || '',
        pro_meta_description: apiProduct.pro_meta_description || apiProduct.pro_meta_sec || '',
        meta_title: apiProduct.meta_title || '',
        parentId: apiProduct.category?.parent_id,
        delivery_charge: apiProduct.delivery_charge ? Number(apiProduct.delivery_charge) : 0,
    };
};

export const transformApiBrand = (apiBrand: any): any => {
    const storageBaseUrl = process.env.NEXT_PUBLIC_BRAND_STORAGE_BASE_URL || 'https://admin.unicodeconverter.info/storage/app/public/brand';

    // Handle missing or placeholder images
    const imageUrl = apiBrand.image && apiBrand.image !== 'no-image.jpg'
        ? `${storageBaseUrl}/${apiBrand.image}`
        : '/assets/images/brands/default-brand.png';

    return {
        id: String(apiBrand.id),
        name: apiBrand.name,
        slug: apiBrand.name.toLowerCase().replace(/\s+/g, '-'), // Generate clean slug
        image: imageUrl,
        type: 'Brand', // Default type
        featured: apiBrand.status === 1
    };
};

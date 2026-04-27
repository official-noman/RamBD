const axios = require('axios');

async function checkApi() {
    try {
        const response = await axios.get('https://admin.unicodeconverter.info/home-menu');
        const data = response.data;
        
        const allKeys = new Set();
        const traverse = (obj) => {
            if (!obj || typeof obj !== 'object') return;
            if (Array.isArray(obj)) {
                obj.forEach(traverse);
            } else {
                Object.keys(obj).forEach(k => {
                    if (k.toLowerCase().includes('desc') || k.toLowerCase().includes('content') || k.toLowerCase().includes('article')) {
                        allKeys.add(k);
                    }
                });
                Object.values(obj).forEach(traverse);
            }
        };

        traverse(data);
        console.log('Detected description-related keys:', Array.from(allKeys));

        // Find items with these keys populated
        const findPopulated = (items) => {
            if (!items) return;
            items.forEach(item => {
                const cat = item.category || item;
                const populated = Array.from(allKeys).filter(k => cat[k] && String(cat[k]).length > 10);
                if (populated.length > 0) {
                    console.log(`Slug: ${cat.cate_slug} | Populated keys:`, populated);
                }
                findPopulated(cat.sub_categories || cat.category_sub_categories || cat.children);
            });
        };

        console.log('\nScanning for populated descriptions:');
        findPopulated(data.menu);
        findPopulated(data.subCategory);

    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

checkApi();

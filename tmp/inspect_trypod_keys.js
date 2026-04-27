const axios = require('axios');

async function checkApi() {
    try {
        const response = await axios.get('https://admin.unicodeconverter.info/home-menu');
        const data = response.data;
        
        const findBySlug = (items, slug) => {
            if (!items) return null;
            for (const item of items) {
                const cat = item.category || item;
                if (cat.cate_slug === slug) return cat;
                const subRes = findBySlug(cat.sub_categories || cat.category_sub_categories || cat.children, slug);
                if (subRes) return subRes;
            }
            return null;
        };

        const trypod = findBySlug(data.menu, 'trypod') || findBySlug(data.subCategory, 'trypod');
        if (trypod) {
            console.log('Trypod keys:', Object.keys(trypod).join(', '));
        } else {
            console.log('Trypod not found');
        }

    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

checkApi();

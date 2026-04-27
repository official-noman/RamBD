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

        const wmic = findBySlug(data.menu, 'wireless-mic') || findBySlug(data.subCategory, 'wireless-mic');
        if (wmic) {
            console.log('Wireless Mic object:', JSON.stringify(wmic, null, 2));
        } else {
            console.log('Wireless Mic not found');
        }

    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

checkApi();

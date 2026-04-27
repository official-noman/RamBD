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

        const slugsToCheck = ['trypod', 'tripod', 'microphone', 'wireless-mic', 'ulanzi'];
        
        console.log('--- Category Check ---');
        slugsToCheck.forEach(slug => {
            const cat = findBySlug(data.menu, slug) || findBySlug(data.subCategory, slug);
            if (cat) {
                console.log(`Slug: ${slug} | Name: ${cat.cate_name} | Has Desc: ${!!cat.cate_desc}`);
                if (cat.cate_desc) {
                   // console.log(`  Desc Length: ${cat.cate_desc.length}`);
                }
            } else {
                console.log(`Slug: ${slug} | NOT FOUND`);
            }
        });

    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

checkApi();

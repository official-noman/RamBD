const axios = require('axios');

async function checkApi() {
    try {
        const response = await axios.get('https://admin.unicodeconverter.info/home-menu');
        const data = response.data;
        
        console.log('Categories found in menu:');
        data.menu?.forEach(m => {
            if (m.category) {
                console.log(`- ${m.category.cate_name} (slug: ${m.category.cate_slug}, has_desc: ${!!m.category.cate_desc})`);
            }
        });

        console.log('\nSub-categories with desc:');
        data.subCategory?.forEach(s => {
            if (s.cate_desc) {
                console.log(`- ${s.cate_name} (slug: ${s.cate_slug}, parent_id: ${s.parent_id})`);
                // console.log(`  Desc: ${s.cate_desc.substring(0, 50)}...`);
            }
        });

        // Example lookup for "microphone"
        const mic = data.menu?.find(m => m.category?.cate_slug === 'microphone');
        if (mic) {
            console.log('\nMicrophone depth 1:', mic.category.cate_name, 'has_desc:', !!mic.category.cate_desc);
        }

    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

checkApi();

const axios = require('axios');

async function checkApi() {
    try {
        const response = await axios.get('https://admin.unicodeconverter.info/home-menu');
        console.log('API structure subCategory[0]:', JSON.stringify(response.data.subCategory?.[0], null, 2));
        console.log('API structure menu[0].category:', JSON.stringify(response.data.menu?.[0]?.category, null, 2));
        
        // Find an item with cate_desc
        const withDesc = response.data.subCategory?.find(s => s.cate_desc);
        if (withDesc) {
            console.log('Sample item with cate_desc:', JSON.stringify(withDesc, null, 2));
        } else {
            console.log('No cate_desc found in subCategory');
        }

        const menuWithDesc = response.data.menu?.find(m => m.category?.cate_desc);
        if (menuWithDesc) {
             console.log('Sample menu item with cate_desc:', JSON.stringify(menuWithDesc.category, null, 2));
        } else {
            console.log('No cate_desc found in menu category');
        }
    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

checkApi();

const axios = require('axios');

const API_BASE_URL = 'https://admin.unicodeconverter.info';

async function testProductSearch(slug) {
    console.log(`\n--- Testing Product Search (searchpro): ${slug} ---`);
    try {
        const url = `${API_BASE_URL}/products/searchpro?search=${slug}`;
        console.log(`URL: ${url}`);
        const response = await axios.get(url);
        const data = response.data;
        
        const products = data.products?.data || (Array.isArray(data.products) ? data.products : []);
        if (products.length > 0) {
            const match = products.find(p => p.pro_slug === slug || p.pro_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === slug);
            if (match) {
                console.log('Match found!');
                console.log('Available keys in Product response:', Object.keys(match));
                console.log('pro_title:', match.pro_title);
                console.log('meta_title:', match.meta_title);
                console.log('pro_meta_key:', match.pro_meta_key);
                console.log('pro_meta_description:', match.pro_meta_description);
                console.log('pro_meta_sec:', match.pro_meta_sec);
                console.log('product_description:', match.product_description ? match.product_description.slice(0, 100) + '...' : 'null');
            } else {
                console.log('No exact match found in search results.');
                if (products[0]) {
                   console.log('First search result keys:', Object.keys(products[0]));
                }
            }
        } else {
            console.log('No products found in search.');
        }
    } catch (error) {
        console.error('Error fetching product search:', error.message);
    }
}

async function testCategories() {
    console.log(`\n--- Testing Category Tree (/home-menu) ---`);
    try {
        const url = `${API_BASE_URL}/home-menu`;
        console.log(`URL: ${url}`);
        const response = await axios.get(url);
        const data = response.data;
        
        if (data.menu && data.menu.length > 0) {
            const firstCat = data.menu[0].category;
            console.log('Sample Category:', firstCat.cate_name);
            console.log('Meta Title:', firstCat.meta_title);
            console.log('Meta Description:', firstCat.meta_description);
            console.log('Cat Meta Keys:', firstCat.cat_meta_keys);
        }

        if (data.subCategory && data.subCategory.length > 0) {
            const firstSub = data.subCategory[0];
            console.log('\nSample SubCategory:', firstSub.cate_name);
            console.log('Meta Title:', firstSub.meta_title);
            console.log('Meta Description:', firstSub.meta_description);
            console.log('Cat Meta Keys:', firstSub.cat_meta_keys);
        }
    } catch (error) {
        console.error('Error fetching category tree:', error.message);
    }
}

const slug = process.argv[2] || 'kamasonic-pa-5085-wall-mounted-speaker';
testProductSearch(slug).then(() => testCategories());

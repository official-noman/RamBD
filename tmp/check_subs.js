const axios = require('axios');

async function checkApi() {
    try {
        const response = await axios.get('https://admin.unicodeconverter.info/home-menu');
        const data = response.data;
        
        console.log('Sub-category [0] structure:', JSON.stringify(data.subCategory?.[0], null, 2));

    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

checkApi();

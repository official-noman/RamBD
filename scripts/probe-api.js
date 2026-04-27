const https = require('https');

const baseUrl = 'https://admin.unicodeconverter.info';

function fetch(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    // Check content type
                    const contentType = res.headers['content-type'];
                    if (contentType && contentType.includes('application/json')) {
                        resolve({ status: res.statusCode, data: JSON.parse(data) });
                    } else {
                        resolve({ status: res.statusCode, data: data.toString().substring(0, 200) });
                    }
                } catch (e) {
                    resolve({ status: res.statusCode, data: data.toString().substring(0, 200) });
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Request error for ${url}:`, e.message);
            resolve({ status: 500, data: null });
        });

        req.end();
    });
}



async function probe() {
    console.log('Searching for sx21 in all lists...');

    const endpoints = [
        '/LatestProductList/getAllLatestProducts',
        '/most-popular-product',
        '/top-rated-product'
    ];

    for (const ep of endpoints) {
        console.log(`Checking ${ep}...`);
        const resp = await fetch(`${baseUrl}${ep}`);
        if (resp.status === 200 && resp.data) {
            let products = [];
            if (resp.data.products) products = resp.data.products;
            else if (resp.data.populars) products = resp.data.populars;

            const target = products.find(p =>
                (p.pro_title && p.pro_title.toLowerCase().includes('sx21')) ||
                (p.pro_slug && p.pro_slug.includes('sx21'))
            );

            if (target) {
                console.log('Found Target Product in', ep);
                console.log(JSON.stringify(target, null, 2));
                return;
            }
        }
    }
    console.log('Product not found in any common list.');
}

probe();

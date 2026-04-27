const https = require('https');

const path = '/storage/app/public/profiles/';
const filename = '1773123297_Dogesh1.jpg';
const domain = 'admin.unicodeconverter.info';

async function checkUrl() {
    return new Promise((resolve) => {
        const options = {
            hostname: domain,
            port: 443,
            path: `${path}${filename}`,
            method: 'HEAD'
        };

        const req = https.request(options, (res) => {
            console.log(`Checking ${path}${filename} -> Status: ${res.statusCode}`);
            resolve(res.statusCode);
        });

        req.on('error', (e) => {
            console.error(`Error checking ${path}: ${e.message}`);
            resolve(500);
        });

        req.end();
    });
}

checkUrl().then(status => {
    if (status === 200) {
        console.log('✅ VALID PATH FOUND');
    } else {
        console.log('❌ PATH IS STILL INVALID');
    }
});

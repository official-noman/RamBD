const path = require('path');
const next = require('next');

// Check if we're running in standalone mode
const serverPath = path.join(__dirname, '.next', 'standalone', 'server.js');
const fs = require('fs');

if (fs.existsSync(serverPath)) {
    // If standalone exists, require and run it
    require(serverPath);
} else {
    // Fallback to standard Next.js server for local dev or if standalone build wasn't done
    const app = next({ dev: process.env.NODE_ENV !== 'production' });
    const handle = app.getRequestHandler();
    const { createServer } = require('http');

    app.prepare().then(() => {
        createServer((req, res) => {
            handle(req, res);
        }).listen(process.env.PORT || 3000, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
        });
    });
}

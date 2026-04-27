const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Enhanced copy function that mimics fs-extra's copySync
 */
function copySync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            copySync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

/**
 * Enhanced remove function that mimics fs-extra's removeSync
 */
function removeSync(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
    }
}

/**
 * Enhanced ensureDir function that mimics fs-extra's ensureDirSync
 */
function ensureDirSync(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

async function prepareForCPanel() {
    const rootDir = path.resolve(__dirname, '..');
    const distDir = path.join(rootDir, 'dist-cpanel');
    const standaloneDir = path.join(rootDir, '.next', 'standalone');
    const staticDir = path.join(rootDir, '.next', 'static');
    const publicDir = path.join(rootDir, 'public');

    console.log('--- Starting cPanel Deployment Preparation ---');

    // 1. Clean and create dist-cpanel directory
    if (fs.existsSync(distDir)) {
        console.log('Cleaning existing dist-cpanel directory...');
        removeSync(distDir);
    }
    ensureDirSync(distDir);

    // 2. Check if standalone build exists
    if (!fs.existsSync(standaloneDir)) {
        console.error('Error: .next/standalone not found. Did you run "npm run build"?');
        process.exit(1);
    }

    // 3. Copy standalone contents
    console.log('Copying standalone files...');
    copySync(standaloneDir, distDir);

    // 4. Copy static files to .next/static
    console.log('Copying .next/static...');
    ensureDirSync(path.join(distDir, '.next', 'static'));
    if (fs.existsSync(staticDir)) {
        copySync(staticDir, path.join(distDir, '.next', 'static'));
    } else {
        console.warn('Warning: .next/static not found.');
    }

    // 5. Copy public folder
    console.log('Copying public folder...');
    if (fs.existsSync(publicDir)) {
        copySync(publicDir, path.join(distDir, 'public'));
    } else {
        console.warn('Warning: public folder not found.');
    }

    // 6. Copy root configuration files
    const configFiles = ['.htaccess', 'server.js', '.env'];
    configFiles.forEach(file => {
        const srcPath = path.join(rootDir, file);
        if (fs.existsSync(srcPath)) {
            console.log(`Copying ${file}...`);
            fs.copyFileSync(srcPath, path.join(distDir, file));
        } else {
            console.warn(`Warning: ${file} not found in root.`);
        }
    });

    // 7. NEW: Ensure Sharp Linux binaries are present
    // This is critical when building on Windows for a Linux cPanel server
    try {
        console.log('\nInstalling Linux-compatible Sharp binaries...');
        // We use npm install with specific platform flags. 
        // This will create/update the node_modules inside dist-cpanel
        execSync('npm install --platform=linux --arch=x64 sharp', {
            cwd: distDir,
            stdio: 'inherit'
        });
        console.log('Linux Sharp binaries installed successfully.');
    } catch (err) {
        console.warn('Warning: Could not install Linux Sharp binaries. Optimization might fail on cPanel.');
        console.warn('Manual fix: Run "npm install --platform=linux --arch=x64 sharp" on your server if images don\'t load.');
    }

    console.log('\n--- SUCCESS: dist-cpanel is ready ---');
    console.log('You can now ZIP the contents of "dist-cpanel" and upload to cPanel.');
}

prepareForCPanel().catch(err => {
    console.error('An error occurred during preparation:', err);
    process.exit(1);
});

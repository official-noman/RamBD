# How to Deploy to cPanel (Automated)

This project is configured with a one-command deployment preparation script.

## Step 1: Build and Package

Run the following command in your terminal:

```bash
npm run package-deploy
```

This command will:
1. Build the production application (`next build`).
2. Collect all required files (standalone build, static assets, public files, and config files) into a `dist-cpanel` folder.
3. Create a **`deploy.zip`** file in your project root.

## Step 2: Upload to cPanel

1. Log in to your **cPanel File Manager**.
2. Navigate to your application root (e.g., `public_html` or a subdirectory).
3. Upload the **`deploy.zip`** file.
4. Extract the contents of `deploy.zip` directly into that folder.

## Step 3: Configure Node.js App in cPanel

1. Go to **Setup Node.js App** in cPanel.
2. Click **Create Application**.
3. Set the following:
   - **Node.js version**: 18.x or 20.x
   - **Application mode**: `production`
   - **Application root**: The folder where you extracted the files (e.g., `public_html`).
   - **Application URL**: Your domain name.
   - **Application startup file**: `server.js`
4. Click **Create**.
5. Your application should now be live!

---

### Key Files included in the Bundle:
- `.next/`: Production build and standalone server.
- `public/`: Static assets (images, favicon, etc.).
- `server.js`: The entry point for cPanel's Node.js handler.
- `.htaccess`: Optimized routing for Next.js.
- `.env`: Environment variables.

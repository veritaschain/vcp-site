# VeritasChain Explorer - Static Deployment Instructions

## 📦 Deployment Package Contents

This package contains static HTML files for the VeritasChain Explorer, ready to be deployed to `https://veritaschain.org/explorer/`

### Directory Structure
```
explorer/
├── index.html           # English version
├── ja/
│   └── index.html       # Japanese version
└── static/
    ├── app.js           # Interactive JavaScript
    └── style.css        # Custom styles
```

## 🚀 Deployment Options

### Option 1: Cloudflare Pages (Recommended)

1. **Create Cloudflare Pages Project**
   ```bash
   npx wrangler pages project create veritaschain-explorer \
     --production-branch main
   ```

2. **Deploy**
   ```bash
   npx wrangler pages deploy explorer/ \
     --project-name veritaschain-explorer \
     --branch main
   ```

3. **Configure Custom Domain**
   - Go to Cloudflare Pages dashboard
   - Select project: `veritaschain-explorer`
   - Add custom domain: `veritaschain.org`
   - Set base path: `/explorer`

### Option 2: Upload to Existing Website

1. **Extract the deployment package**
   ```bash
   tar -xzf veritaschain-explorer-static-deploy.tar.gz
   ```

2. **Upload `explorer/` directory to your web server**
   - Place the entire `explorer/` folder in your website root
   - Final structure: `https://veritaschain.org/explorer/`

3. **Verify deployment**
   - English: `https://veritaschain.org/explorer/`
   - Japanese: `https://veritaschain.org/explorer/ja/`

### Option 3: FTP/SFTP Upload

1. **Connect to your web server via FTP/SFTP**
   - Host: `veritaschain.org`
   - Port: 21 (FTP) or 22 (SFTP)

2. **Navigate to website root directory**
   ```
   /public_html/
   or
   /www/
   or
   /htdocs/
   ```

3. **Upload the `explorer/` folder**
   - Upload entire `explorer/` directory with all subdirectories
   - Maintain directory structure

4. **Set correct permissions** (if using SFTP)
   ```bash
   chmod -R 755 explorer/
   chmod 644 explorer/index.html
   chmod 644 explorer/ja/index.html
   chmod 644 explorer/static/*
   ```

## ✅ Post-Deployment Verification

### Test URLs
- **English**: https://veritaschain.org/explorer/
- **Japanese**: https://veritaschain.org/explorer/ja/

### Verification Checklist
- [ ] English page loads correctly
- [ ] Japanese page loads correctly
- [ ] Language switcher works (EN ↔ 日本語)
- [ ] All static assets (CSS, JS) load without errors
- [ ] Live stats display properly
- [ ] Event table renders correctly
- [ ] Merkle tree visualization appears
- [ ] Copy buttons work
- [ ] All links are functional
- [ ] Mobile responsive design works

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Configuration

### CDN Resources (External)
The following resources are loaded from CDN:
- Tailwind CSS: `https://cdn.tailwindcss.com`
- Font Awesome: `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css`

### Internal Resources (Relative Paths)
All internal resources use relative paths:
- CSS: `/explorer/static/style.css`
- JavaScript: `/explorer/static/app.js`
- Language switcher links are configured for `/explorer/` base path

## 🌐 DNS Configuration (if needed)

If deploying to a subdomain like `explorer.veritaschain.org`:

1. **Add CNAME record**
   - Name: `explorer`
   - Target: Your hosting provider's domain
   - TTL: 300 (5 minutes) or Auto

2. **Update paths in HTML files**
   ```bash
   # Change /explorer/ to /
   sed -i 's|/explorer/|/|g' explorer/index.html
   sed -i 's|/explorer/|/|g' explorer/ja/index.html
   ```

## 🐛 Troubleshooting

### Issue: 404 Not Found
- **Cause**: Incorrect upload path or missing files
- **Solution**: Ensure `explorer/` directory is in the website root

### Issue: Language switcher redirects to wrong URL
- **Cause**: Incorrect base path configuration
- **Solution**: Verify paths in HTML match your deployment structure

### Issue: CSS/JS not loading (404 errors)
- **Cause**: Incorrect static asset paths
- **Solution**: Check browser console for exact failing URLs and adjust paths

### Issue: Blank page or JavaScript errors
- **Cause**: Missing dependencies or CORS issues
- **Solution**: 
  - Check browser console for errors
  - Verify CDN resources are accessible
  - Ensure JavaScript file loaded correctly

## 📊 File Sizes
- `index.html` (English): ~19KB
- `ja/index.html` (Japanese): ~20KB
- `static/app.js`: ~5.7KB
- `static/style.css`: ~4.4KB
- **Total package size**: ~9.1KB (compressed)

## 🔒 Security Considerations

### Content Security Policy (Optional)
Add to `.htaccess` or server configuration:
```apache
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; font-src 'self' https://cdn.jsdelivr.net; img-src 'self' data:;"
```

### HTTPS Enforcement
Ensure all traffic uses HTTPS:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 📝 Maintenance

### Updating Content
1. Modify source files in the project
2. Regenerate static HTML
3. Re-deploy using one of the methods above

### Version Control
- Current version: v1.1 (Multi-language)
- Deployed date: 2025-11-23
- Git commit: `f5e5f83`

## 📞 Support

For issues or questions:
- Project repository: (GitHub URL)
- Documentation: This file
- Contact: VeritasChain Standards Organization (VSO)

---

**Deployment Package Created**: 2025-11-23
**Package Name**: `veritaschain-explorer-static-deploy.tar.gz`
**Ready for**: `https://veritaschain.org/explorer/`

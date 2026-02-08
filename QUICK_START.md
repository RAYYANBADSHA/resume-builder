# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Visit: `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```
Output: `dist/` folder with `index.html`

---

## 📦 Deploy to Netlify

### Method 1: Git Deploy (Recommended)
1. Push code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Settings auto-detected from `netlify.toml` ✅
6. Click "Deploy"

### Method 2: Drag & Drop
1. Run `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `dist/` folder
4. Done! 🎉

### Method 3: CLI Deploy
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## ✅ What Changed?

| Before (SSR) | After (SPA) |
|--------------|-------------|
| `react-router` | `react-router-dom` |
| `react-router dev` | `vite` |
| `build/client/` | `dist/` with `index.html` |
| Server-side rendering | Client-side only |
| File-based routing | Component-based routing |

---

## 🔍 Verify Deployment

After deploying, test these URLs:
- ✅ `https://your-site.netlify.app/`
- ✅ `https://your-site.netlify.app/auth`
- ✅ `https://your-site.netlify.app/upload`
- ✅ `https://your-site.netlify.app/resume/123`

All should work without 404 errors!

---

## 📁 New Project Structure

```
your-project/
├── src/                    # Source code
│   ├── main.tsx           # Entry point
│   ├── App.tsx            # Routes
│   ├── routes/            # Pages
│   ├── components/        # UI components
│   └── lib/               # Utilities
├── public/                # Static assets
│   └── _redirects         # SPA routing
├── index.html             # HTML template
├── dist/                  # Build output
└── netlify.toml           # Netlify config
```

---

## 🛠️ Available Scripts

```bash
npm run dev       # Start dev server (port 5173)
npm run build     # Build for production
npm run preview   # Preview production build
npm run typecheck # Check TypeScript types
```

---

## ⚠️ Important Notes

- All routes now use `react-router-dom` imports
- Meta tags are in `index.html` (use react-helmet for dynamic meta)
- Build output is in `dist/` folder
- Netlify handles SPA routing via `_redirects` file
- Original `app/` folder kept for reference

---

## 🆘 Troubleshooting

**404 on routes?**
→ Check `public/_redirects` exists

**Build fails?**
→ Run `npm run build` locally to see errors

**Assets not loading?**
→ Use `/images/file.png` (with leading slash)

**TypeScript errors?**
→ Run `npm run typecheck`

---

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Complete migration details

---

**Ready to deploy? Run `npm install` and `npm run dev` to get started!** 🚀

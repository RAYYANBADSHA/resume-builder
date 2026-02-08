# Deployment Guide - Static SPA on Netlify

## Project Structure

```
├── src/
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Main app with routes
│   ├── app.css           # Global styles
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   └── routes/           # Page components
├── public/               # Static assets
│   └── _redirects        # Netlify SPA routing
├── index.html            # HTML entry point
├── dist/                 # Build output (generated)
└── netlify.toml          # Netlify configuration
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```
   Generates `dist/` folder with `index.html` at root

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Netlify Deployment

### Option 1: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Git

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Build settings are auto-detected from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### Option 3: Manual Deploy

1. Build locally:
   ```bash
   npm run build
   ```

2. Drag and drop the `dist` folder to Netlify's deploy zone

## Configuration Files

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### public/_redirects
```
/*    /index.html   200
```

This ensures all routes are handled by React Router on the client side.

## Key Changes from SSR to SPA

1. ✅ Replaced `react-router` (v7 SSR) with `react-router-dom` (client-side)
2. ✅ Removed `@react-router/dev`, `@react-router/node`, `@react-router/serve`
3. ✅ Added `@vitejs/plugin-react` for Vite SPA build
4. ✅ Created `index.html` as entry point
5. ✅ Created `src/main.tsx` with `ReactDOM.createRoot`
6. ✅ Moved routes from file-based to component-based routing
7. ✅ Updated all imports from `react-router` to `react-router-dom`
8. ✅ Configured Vite to output to `dist/` folder
9. ✅ Added `_redirects` for Netlify SPA routing

## Verification

After deployment, verify:
- ✅ Homepage loads at root URL
- ✅ Direct navigation to `/upload`, `/auth`, etc. works
- ✅ Browser refresh on any route doesn't show 404
- ✅ All static assets (images, icons) load correctly
- ✅ Client-side routing works without page reloads

## Troubleshooting

**404 on routes:** Ensure `_redirects` file is in `public/` folder and `netlify.toml` has correct redirects configuration.

**Build fails:** Run `npm run build` locally to see detailed errors. Check that all imports use `react-router-dom` instead of `react-router`.

**Assets not loading:** Verify paths in your code use `/` prefix for public assets (e.g., `/images/logo.png`).

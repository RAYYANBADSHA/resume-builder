# Architecture Overview

## 🏗️ Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                                                              │
│  User visits: https://your-site.netlify.app/upload          │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Netlify CDN                               │
│                                                              │
│  1. Receives request for /upload                            │
│  2. Checks _redirects file                                  │
│  3. Serves index.html (SPA entry point)                     │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    index.html                                │
│                                                              │
│  <div id="root"></div>                                      │
│  <script src="/src/main.tsx"></script>                      │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    src/main.tsx                              │
│                                                              │
│  ReactDOM.createRoot(...)                                   │
│  <BrowserRouter>                                            │
│    <App />                                                  │
│  </BrowserRouter>                                           │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    src/App.tsx                               │
│                                                              │
│  <Routes>                                                   │
│    <Route path="/" element={<Home />} />                    │
│    <Route path="/auth" element={<Auth />} />                │
│    <Route path="/upload" element={<Upload />} />            │
│    <Route path="/resume/:id" element={<Resume />} />        │
│  </Routes>                                                  │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Route Component                              │
│                 (e.g., Upload)                               │
│                                                              │
│  - Renders UI                                               │
│  - Uses hooks (useState, useEffect)                         │
│  - Imports components from src/components/                  │
│  - Uses utilities from src/lib/                             │
└──────────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure

```
your-project/
│
├── 📄 index.html                    # HTML entry point
│   └── Contains: <div id="root"></div>
│
├── 📁 src/                          # Source code
│   │
│   ├── 📄 main.tsx                  # React entry point
│   │   └── Renders: <BrowserRouter><App /></BrowserRouter>
│   │
│   ├── 📄 App.tsx                   # Main app component
│   │   └── Contains: <Routes> with all route definitions
│   │
│   ├── 📄 app.css                   # Global styles
│   │
│   ├── 📁 routes/                   # Page components
│   │   ├── home.tsx                 # Homepage (/)
│   │   ├── auth.tsx                 # Auth page (/auth)
│   │   ├── upload.tsx               # Upload page (/upload)
│   │   ├── resume.tsx               # Resume detail (/resume/:id)
│   │   └── wipe.tsx                 # Wipe data (/wipe)
│   │
│   ├── 📁 components/               # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── FileUploader.tsx
│   │   ├── ResumeCard.tsx
│   │   ├── ScoreGauge.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ... (other components)
│   │
│   └── 📁 lib/                      # Utility functions
│       ├── puter.ts                 # Puter SDK integration
│       ├── pdf2img.ts               # PDF conversion
│       └── utils.ts                 # Helper functions
│
├── 📁 public/                       # Static assets
│   ├── _redirects                   # Netlify SPA routing
│   ├── favicon.ico
│   ├── 📁 images/
│   └── 📁 icons/
│
├── 📁 dist/                         # Build output (generated)
│   ├── index.html                   # Built HTML
│   ├── 📁 assets/
│   │   ├── index-[hash].js          # Bundled JavaScript
│   │   └── index-[hash].css         # Bundled CSS
│   └── ... (copied public assets)
│
├── 📄 vite.config.ts                # Vite configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 netlify.toml                  # Netlify configuration
├── 📄 package.json                  # Dependencies & scripts
│
└── 📁 app/                          # OLD structure (keep for reference)
    └── ... (original React Router v7 files)
```

## 🔄 Request Flow Diagram

### Development Mode (`npm run dev`)

```
User Request
     │
     ▼
Vite Dev Server (localhost:5173)
     │
     ├─→ /                    → index.html → main.tsx → App.tsx → Home
     ├─→ /auth                → index.html → main.tsx → App.tsx → Auth
     ├─→ /upload              → index.html → main.tsx → App.tsx → Upload
     └─→ /resume/:id          → index.html → main.tsx → App.tsx → Resume
```

### Production Mode (Netlify)

```
User Request
     │
     ▼
Netlify CDN
     │
     ▼
Check _redirects
     │
     ├─→ /* → index.html (200)
     │
     ▼
Browser receives index.html
     │
     ▼
Loads JavaScript bundle
     │
     ▼
React Router DOM
     │
     ├─→ /                    → Home component
     ├─→ /auth                → Auth component
     ├─→ /upload              → Upload component
     └─→ /resume/:id          → Resume component
```

## 🔧 Build Process

```
npm run build
     │
     ▼
┌─────────────────────────┐
│   TypeScript Compiler   │
│   (tsc)                 │
│   - Type checking       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Vite Build            │
│   - Bundle JavaScript   │
│   - Process CSS         │
│   - Optimize assets     │
│   - Generate hashes     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   dist/ folder          │
│   ├── index.html        │
│   ├── assets/           │
│   │   ├── index-abc.js  │
│   │   └── index-xyz.css │
│   └── (public assets)   │
└─────────────────────────┘
```

## 🚀 Deployment Flow

```
Local Machine
     │
     ├─→ npm run build
     │
     ▼
dist/ folder created
     │
     ├─→ Option 1: Git Push
     │        │
     │        ▼
     │   GitHub/GitLab
     │        │
     │        ▼
     │   Netlify (auto-deploy)
     │
     ├─→ Option 2: Netlify CLI
     │        │
     │        ▼
     │   netlify deploy --prod
     │
     └─→ Option 3: Manual
              │
              ▼
         Drag & drop dist/
              │
              ▼
         Netlify Dashboard
              │
              ▼
         Site deployed
              │
              ▼
    https://your-site.netlify.app
```

## 🎯 Component Hierarchy

```
App (src/App.tsx)
│
├── Routes
│   │
│   ├── Route: /
│   │   └── Home (src/routes/home.tsx)
│   │       ├── Navbar
│   │       └── ResumeCard (multiple)
│   │           ├── ScoreBadge
│   │           └── ScoreCircle
│   │
│   ├── Route: /auth
│   │   └── Auth (src/routes/auth.tsx)
│   │       └── (auth UI)
│   │
│   ├── Route: /upload
│   │   └── Upload (src/routes/upload.tsx)
│   │       ├── Navbar
│   │       └── FileUploader
│   │
│   ├── Route: /resume/:id
│   │   └── Resume (src/routes/resume.tsx)
│   │       ├── Summary
│   │       ├── ATS
│   │       │   ├── ScoreGauge
│   │       │   └── Accordion
│   │       └── Details
│   │           └── Accordion (multiple)
│   │
│   └── Route: *
│       └── ErrorBoundary
```

## 🔐 State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    Zustand Store                             │
│                    (src/lib/puter.ts)                        │
│                                                              │
│  - auth: { isAuthenticated, user, signIn, signOut }         │
│  - fs: { upload, read, readDir, delete }                    │
│  - kv: { get, set, list, flush }                            │
│  - ai: { feedback }                                         │
│  - isLoading, error                                         │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ usePuterStore()
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
    Home.tsx           Upload.tsx          Resume.tsx
    - auth             - auth              - auth
    - kv.list()        - fs.upload()       - kv.get()
                       - ai.feedback()     - fs.read()
```

## 📦 Bundle Structure (Production)

```
dist/
│
├── index.html                           # Entry HTML
│   └── References: /assets/index-[hash].js
│
├── assets/
│   ├── index-abc123.js                  # Main bundle
│   │   ├── React & React DOM
│   │   ├── React Router DOM
│   │   ├── All components
│   │   ├── All routes
│   │   ├── Zustand store
│   │   └── Utilities
│   │
│   └── index-xyz789.css                 # Styles bundle
│       ├── Tailwind CSS
│       └── Custom styles
│
├── images/                              # Static images
├── icons/                               # Static icons
└── _redirects                           # Netlify routing
```

## 🌐 Routing Mechanism

### Traditional Multi-Page App (MPA)
```
/              → Server sends home.html
/auth          → Server sends auth.html
/upload        → Server sends upload.html
```

### Single-Page App (SPA) - Your Setup
```
/              → Server sends index.html → React Router → Home component
/auth          → Server sends index.html → React Router → Auth component
/upload        → Server sends index.html → React Router → Upload component
```

**Key Point:** Netlify always serves `index.html`, then React Router handles the routing in the browser.

## 🔄 Data Flow Example: Upload Resume

```
1. User visits /upload
        │
        ▼
2. Netlify serves index.html
        │
        ▼
3. React loads, Router matches /upload
        │
        ▼
4. Upload component renders
        │
        ▼
5. User selects file
        │
        ▼
6. FileUploader component
        │
        ▼
7. User clicks "Analyze"
        │
        ▼
8. Upload.tsx calls:
   - fs.upload(file)           → Puter API
   - convertPdfToImage(file)   → Local processing
   - fs.upload(image)          → Puter API
   - kv.set(data)              → Puter API
   - ai.feedback(...)          → Puter API
        │
        ▼
9. navigate(`/resume/${id}`)
        │
        ▼
10. React Router navigates to Resume component
        │
        ▼
11. Resume component loads and displays data
```

## 🎨 Styling Architecture

```
index.html
    │
    └─→ Loads Google Fonts
         │
         ▼
src/main.tsx
    │
    └─→ Imports src/app.css
         │
         ├─→ Tailwind CSS directives
         │   ├── @tailwind base
         │   ├── @tailwind components
         │   └── @tailwind utilities
         │
         └─→ Custom CSS classes
             ├── .main-section
             ├── .page-heading
             ├── .primary-button
             └── ... (other custom classes)
```

---

## 🔑 Key Architectural Decisions

### Why SPA over SSR?

| Aspect | SSR (Before) | SPA (After) | Winner |
|--------|--------------|-------------|--------|
| Netlify Compatibility | ❌ Complex | ✅ Simple | SPA |
| Deployment | Requires server | Static files | SPA |
| Cost | Higher | Lower/Free | SPA |
| Build Complexity | High | Low | SPA |
| SEO | Better | Good enough | SSR |
| Initial Load | Faster | Slightly slower | SSR |
| Navigation | Fast | Fast | Tie |

**For your use case (authenticated app with file uploads), SPA is the better choice.**

### Why React Router DOM v7?

- ✅ Latest stable version
- ✅ Full TypeScript support
- ✅ Modern hooks API
- ✅ Client-side routing
- ✅ Compatible with Vite
- ✅ Smaller bundle size

### Why Vite?

- ✅ Fast development server
- ✅ Optimized production builds
- ✅ Built-in TypeScript support
- ✅ Modern ESM-based
- ✅ Great plugin ecosystem
- ✅ Perfect for React SPAs

---

**This architecture provides a solid foundation for your Netlify-hosted SPA! 🚀**

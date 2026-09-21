# VAULT IB - PROJECT BRAIN

**Last Updated**: 2025-09-19  
**Repository**: `sarang-cmd/vault-ib`  
**Stack**: React 19 + TypeScript + Vite + Tailwind CSS + Supabase (Postgres) + Vercel  
**Cost**: $0/month (Free Forever Tiers)

---

## 🎯 PROJECT OVERVIEW

**Vault IB** - A curated, community-driven directory of 168+ free and freemium study resources for the IB Diploma Programme. Organized by subject, verified by students.

**Production URLs**:
- Primary: `https://vault-ib.vercel.app` (or `https://vault-ib-six.vercel.app`)
- Mirror: `https://ib-vault-pro.vercel.app`
- Dashboard: `/dashboard` route
- Admin: `/admin` route
- Categories: `/category/:slug` routes

---

## ✅ COMPLETED FEATURES

### Core Application
- [x] **React 19 + TypeScript + Vite** setup with Tailwind CSS v4
- [x] **Supabase (Postgres)** integration with RLS policies
- [x] **Vercel deployment** with Analytics + Speed Insights
- [x] **Hybrid data layer**: Supabase when configured, localStorage fallback
- [x] **ThemeProvider** with dark/light mode toggle (persisted in localStorage)
- [x] **Responsive CSS Grid** with auto-fill minmax(280px, 1fr)
- [x] **Dark mode** with CSS variables (`.dark` class on `<html>`)

### Landing Page (`/dashboard`)
- [x] **Hero section** with stats, CTA buttons, animated category groups
- [x] **Categories organized as**: All Subjects, HSLs (HL), SLS (SL), Core & Tools
- [x] **Quick Actions** cards: Master Hubs, Past Papers, AI Tools, Grade Calculator
- [x] **Community Mirrors** section with pirateIB, ibresources links
- [x] **Community Links**: r/IBO, IBO Discord
- [x] **Footer CTA** with "Enter the Vault" button

### Main Board (`/board`)
- [x] **Trello-style column grid** with 3 pinned columns + 18 category columns
- [x] **Pinned Columns**: Trending This Week, Favorites, New Tools (always first when "All Columns" selected)
- [x] **Subject filter bar**: All Columns, Maths & Sciences, Humanities & Languages, Core/Repos/Exemplars, Calculators/AI/Media
- [x] **Advanced filter bar**: Cost (Free/Freemium), Category, Status, Sort (name/category/rating/date/clicks asc/desc), quick filters
- [x] **Column reordering** via drag-and-drop (only in reorder mode from Settings)
- [x] **Column order persistence** in localStorage
- [x] **Pinned columns hide** when subject filter ≠ "All Columns"
- [x] **Filter persistence** on reload (localStorage)
- [x] **Click tracking** for Trending algorithm (localStorage)

### Resource Items
- [x] **Entire card clickable** → opens details modal
- [x] **Resource name** button → opens details modal
- [x] **External link icon on hover** → opens in new tab
- [x] **Favorite toggle** with star icon
- [x] **Broken link indicator** (red triangle)
- [x] **NEW badge** for new resources
- [x] **Hover tooltip** with description, rating stars, cost badge, visit link
- [x] **Click tracking** for Trending (localStorage)

### Category View (`/category/:slug`)
- [x] **Full category page** with filtered resources
- [x] **PDF export** with Vault IB logo, category title, date
- [x] **Report broken link** modal
- [x] **Add to favorites** modal

### Admin Panel (`/admin`)
- [x] **Password protection** (bcrypt hash in `VITE_ADMIN_PASSWORD_HASH`)
- [x] **Pending submissions** tab (approve/reject)
- [x] **All resources table** with link health (broken/approved)
- [x] **Star rating system** (1-5 stars, click to rate)
- [x] **Comprehensive filters**: Cost, Category, Status, Rating
- [x] **Advanced sort** (name/category/rating/date/clicks asc/desc)
- [x] **Quick filter presets**: Clear All, Show Broken Only, Free & Approved
- [x] **Resource rating** (click stars to rate 1-5)
- [x] **Approve/Reject** submissions
- [x] **Toggle broken/healthy** status
- [x] **Reset to defaults** (168 initial resources)

### PDF Export
- [x] **Clickable links** in exported PDF
- [x] **Vault IB logo** embedded as inline SVG
- [x] **Category title**, export date, resource count
- [x] **Table** with #, Name (clickable link), Description, Access, Rating (stars)
- [x] **Footer** with Vault IB branding, primary URL, mirror URL
- [x] **Vault IB logo** embedded in PDF header

### Navigation
- [x] **TopBar**: Dashboard link, Suggest Link, Search (⌘K), Dark mode toggle, Settings
- [x] **Sidebar**: Dashboard, Home, Favorites, Trending, New Tools, Activity Log, Categories, Suggest Resource, About, Admin, PDF Export, r/IBO link
- [x] **Routing**: `/`, `/dashboard`, `/board`, `/category/:slug`, `/about`, `/submit`, `/admin`
- [x] **Hash-based routing** with popstate support

### Supabase Integration
- [x] **Schema**: `resources` table with RLS policies
- [x] **Policies**: Public read (approved), Public insert (pending), Admin full access
- [x] **Migration**: 168 initial resources with September 2026 dates
- [x] **Hybrid mode**: Works offline with localStorage fallback

---

## 🔄 IN PROGRESS / PENDING

### High Priority
- [ ] **Research and add 10+ verified AI study tools for IB**
- [ ] **Add smooth animations/transitions** between views (Framer Motion or CSS transitions)
- [ ] **Make PDF export links clickable** (verify in production)
- [ ] **Add PDF print options modal** (checkboxes: include footer, logo, remove NEW badges, custom footer)
- [ ] **Polish printing** with Vault IB logo, better page breaks
- [ ] **Add smooth loading animation** (skeleton loaders)
- [ ] **Add hover card positioning logic** (left/right based on screen position)

### Medium Priority
- [ ] **Update README.md** with mirror links, new features, dashboard info
- [ ] **Update DEPLOYMENT_GUIDE.md** with new features, dashboard route, PDF options
- [ ] **Update PROJECT_BRAIN.md** with all changes (this file)
- [ ] **Create agents.md/CLAUDE.md** for other agents
- [ ] **Add hover card positioning logic** (left/right based on screen position)
- [ ] **Quality-of-life improvements and polish**

---

## 🐛 KNOWN ISSUES

### Fixed (but verify in production)
- [x] **Dark mode toggle** - fixed with CSS variables
- [x] **Kognity in AI Tools** - moved to Textbooks & eBooks category
- [x] **White text on dark headers** - fixed with CSS variables
- [x] **Column reordering persistence** - pinned columns always first
- [x] **Filter persistence on reload** - localStorage sync
- [x] **Humanities & Languages filter** - fixed categories
- [x] **Pinned columns hide on filter** - only show when "All Columns"
- [x] **Resource card clickable** - entire card opens details
- [x] **External link icon on hover** - opens in new tab
- [x] **Click tracking for Trending** - localStorage
- [x] **Column gap at top** - added `pt-2` to column body

> **⚠️ PRODUCTION VERIFICATION NEEDED**: All fixes above are implemented in code and pushed to GitHub, but **have not been verified in production** at `https://vault-ib.vercel.app` (or `https://vault-ib-six.vercel.app`). Need to manually verify each fix in the live Vercel deployment after the latest commit is deployed.

### Remaining
- [ ] **PDF export links** - verify clickable in browser print dialog
- [ ] **Hover tooltip positioning** - left/right based on screen edge
- [ ] **Smooth view transitions** - Framer Motion or CSS
- [ ] **Loading skeleton** - for initial load and category switches
- [ ] **Hover tooltip positioning** - left/right based on viewport edge

---

## 📁 PROJECT STRUCTURE

```
IB-Vault_Public/
├── public/
│   ├── favicon.svg              # Vault IB logo (terracotta vault + IB)
│   ├── favicon-*.png            # Various sizes
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── DashboardView.tsx    # Landing page at /dashboard
│   │   ├── BoardView.tsx        # Main column grid with filters
│   │   ├── Column.tsx           # Individual column component
│   │   ├── ResourceItem.tsx     # Clickable card with hover tooltip
│   │   ├── CategoryView.tsx     # Single category page
│   │   ├── AboutView.tsx        # About page with activity log
│   │   ├── SubmitModal.tsx      # Submit resource form
│   │   ├── AdminView.tsx        # Admin panel with full features
│   │   ├── SearchModal.tsx      # Global search (⌘K)
│   │   ├── SettingsModal.tsx    # Density, favorites, reorder mode, admin
│   │   ├── ResourceDetailModal.tsx # Full resource details
│   │   ├── ReportModal.tsx      # Report broken link
│   │   ├── AddFavoriteModal.tsx # Quick favorite selector
│   │   ├── TopBar.tsx           # Dashboard link, search, dark mode, settings
│   │   ├── Sidebar.tsx          # Nav drawer with Dashboard link
│   │   ├── Column.tsx           # Column with drag handle
│   │   ├── CategoryIcon.tsx     # Category icons
│   │   ├── AddFavoriteModal.tsx # Quick favorite selector
│   │   ├── ReportModal.tsx      # Report broken link
│   │   ├── SubmitModal.tsx      # Submit resource
│   │   ├── ResourceDetailModal.tsx # Full details modal
│   │   ├── SearchModal.tsx      # Global search
│   │   └── SettingsModal.tsx    # Settings with reorder mode toggle
│   ├── context/
│   │   └── ThemeContext.tsx     # Dark/light theme provider
│   ├── data/
│   │   ├── categories.ts        # 18 categories + 3 pinned columns
│   │   ├── resources.ts         # 168 resources (source of truth)
│   │   ├── resources.json       # Mirror for migration
│   │   └── activityLog.ts       # Activity log entries
│   ├── lib/
│   │   ├── supabase.ts          # Hybrid data layer (Supabase + localStorage)
│   │   ├── supabaseClient.ts    # Supabase client init
│   │   └── pdfExport.ts         # PDF export with logo, clickable links
│   ├── types.ts                 # TypeScript interfaces
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Tailwind + CSS variables for themes
│   └── vite-env.d.ts
├── supabase/
│   └── migrations/
│       └── 01_resources.sql     # Schema + 168 seed + RLS policies
├── scripts/
│   └── regenerate_migration.py  # Regenerate migration from resources.ts
├── .env.example                 # Env template
├── vercel.json                  # SPA routing + security headers
├── package.json
├── tsconfig.json
├── DEPLOYMENT_GUIDE.md          # Click-by-click deployment guide
├── PROJECT_BRAIN.md             # This file
└── README.md
```

---

## 🔧 TECH DECISIONS

| Decision | Rationale |
|----------|-----------|
| **React 19 + Vite** | Fast HMR, modern React features |
| **Tailwind CSS v4** | CSS-first config, native dark mode support |
| **Supabase (Postgres)** | Free tier generous, RLS for authz |
| **Vercel** | Free tier generous, SPA routing, auto-deploy |
| **localStorage fallback** | Works offline, no backend needed for demo |
| **Hash routing** | Works on static hosting, no server config |
| **bcryptjs in browser** | Admin auth without backend |
| **Click tracking localStorage** | Trending algorithm without backend |
| **CSS variables for theming** | No Tailwind dark: prefix needed |
| **Hash-based routing** | Works on static hosting |

---

## 🚀 DEPLOYMENT CHECKLIST

### Supabase
- [ ] Create project at supabase.com
- [ ] Run `supabase/migrations/01_resources.sql` in SQL Editor
- [ ] Copy Project URL → `VITE_SUPABASE_URL`
- [ ] Copy anon public key → `VITE_SUPABASE_ANON_KEY`

### Vercel
- [ ] Import GitHub repo
- [ ] Framework: Vite (auto-detected)
- [ ] Build: `npm run build`
- [ ] Output: `dist`
- [ ] Add env vars (Config type, NOT Secret):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_ADMIN_PASSWORD_HASH` (generate: `node -e "console.log(require('bcryptjs').hashSync('password', 12))"`)
- [ ] Disable "Vercel Authentication" in Settings → General
- [ ] Redeploy after env vars

### Post-Deploy Verification
- [ ] Homepage loads at `https://your-app.vercel.app`
- [ ] Dashboard at `/dashboard`
- [ ] Board at `/board` with 168 resources
- [ ] Admin at `/admin` with password
- [ ] Submit resource → appears in Supabase as `pending`
- [ ] Admin → Approve → appears on board
- [ ] PDF export → clickable links in print dialog
- [ ] Dark mode toggle works
- [ ] Column reorder persists in localStorage

---

## 📊 DATA SUMMARY

- **168 resources** across 18 categories + 3 pinned columns
- **Categories reordered**: All Subjects (5) → HSLs (3) → SLS (3) → Core & Tools (7)
- **Pinned columns**: Trending This Week, Favorites, New Tools
- **Subject groups**: All Columns, Maths & Sciences, Humanities & Languages, Core/Repos/Exemplars, Calculators/AI/Media
- **Advanced filters**: Cost, Category, Status, Sort (5 fields × asc/desc)
- **Quick filters**: Clear All, Show Broken, Free & Approved

---

## 🔐 ENVIRONMENT VARIABLES

```bash
# Required (Config type in Vercel, NOT Secret)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_PASSWORD_HASH=$2a$12$...  # bcrypt hash of admin password
```

---

## 📝 NEXT SESSION PRIORITIES

1. **Add 10+ verified AI study tools** for IB
2. **Implement hover tooltip positioning** (viewport edge detection)
3. **Add smooth view transitions** (AnimatePresence + Framer Motion)
4. **Add loading skeletons** for initial load
5. **Update documentation** (README, DEPLOYMENT_GUIDE, PROJECT_BRAIN)
6. **Create agents.md/CLAUDE.md** for other agents
7. **Verify PDF links clickable** in production
8. **Add hover tooltip edge detection** (viewport edges)

---

*Generated: 2025-09-19 | This file is the single source of truth for Vault IB project state*
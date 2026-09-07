# Robel Fekadu - Portfolio Website

A modern, high-performance portfolio website built with React, TypeScript, and Tailwind CSS, showcasing systems engineering expertise and projects.

## 🚀 Features

- **Dark/Light Mode** - Seamless theme switching with system preference detection
- **Command Palette** - `Ctrl/Cmd + K` for navigation, theme, résumé and contact
- **Interactive Components** - Terminal-style skill display and architecture diagrams
- **8 Featured Projects** - Comprehensive project showcase with technical details
- **Responsive Design** - Optimized for all screen sizes
- **SEO Optimized** - Meta tags, Open Graph card, canonical URL, sitemap
- **Accessibility** - Skip-to-content, keyboard-operable disclosures, AA contrast
  (verified with axe-core: 0 violations at 1440px light/dark and 390px)
- **Performance** - Built with Vite for lightning-fast builds and HMR

## 🛠️ Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel (configured)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/robavelii/my-site.git
cd my-site

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`

## 🏗️ Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🚢 Deployment

Vercel builds and serves the site as the origin. Cloudflare sits in front of it and
owns DNS, caching, and response headers.

**Caching and headers are configured in Cloudflare, not in `vercel.json`.** That is
deliberate: Cloudflare's zone settings override origin headers, so keeping a `headers`
block in `vercel.json` as well would create two sources of truth where only one wins.
The Cloudflare side lives in [`infra/cloudflare-config.sh`](./infra/cloudflare-config.sh) —
run it with no arguments for a dry run that prints the current state and the proposed
changes, or `--apply` to commit them (it backs up the existing config first).

The Content-Security-Policy is defined in [`infra/csp.sh`](./infra/csp.sh). It allows the
inline theme guard by SHA-256 hash rather than `'unsafe-inline'`, so **Rocket Loader must
stay off** and editing that inline script means updating the hash —
`infra/verify-csp-hash.sh` enforces this and CI runs it.

One known CSP violation is expected: Cloudflare **JS Detections** injects a nonce-less
inline script that cannot be hashed reliably. See the notes in `infra/csp.sh`; the site is
fully functional either way.

### Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

## 📁 Project Structure

```
├── public/              # Static assets
│   ├── favicon.svg      # Custom favicon
│   ├── robots.txt       # SEO crawler instructions
│   └── sitemap.xml      # XML sitemap
├── src/
│   ├── components/      # React components
│   │   ├── layout/      # Header, Footer
│   │   ├── sections/    # Hero, Projects, Contact, etc.
│   │   └── ui/          # Reusable UI components
│   ├── context/         # Theme context
│   ├── data/            # Project and service data
│   └── hooks/           # Custom React hooks
├── App.tsx              # Main app component
├── index.html           # HTML entry point
└── vercel.json          # Vercel configuration
```

## ⌨️ Keyboard Shortcuts

- `Ctrl + K` / `Cmd + K` - open the command palette
- Inside the palette: `↑`/`↓` to move, `↵` to run, `esc` to close

## 🎨 Customization

### Update Personal Information

1. **Images:** `public/avatar.jpg` (256px square, shown in the hero) and
   `public/og-card.jpg` (1200x630 social card, regenerate with
   `./infra/build-og-card.sh`). `public/robel-fekadu.jpg` is the full-size source.
2. **Résumé:** `./infra/resume.sh path/to/new.pdf` publishes a new PDF with no
   rebuild and no redeploy — see [Updating the résumé](#updating-the-résumé).
3. **Email:** Change `CONTACT_EMAIL` in `src/data/constants.ts` - it is the
   single source for the footer, the contact card and both CTAs
4. **Projects:** Edit `src/data/constants.ts` to add/modify projects
5. **Social Links:** Update GitHub, LinkedIn URLs in `Contact.tsx` and `App.tsx`

### Add Sections

Testimonials and Certifications sections are already created but hidden. To enable:

```tsx
// In App.tsx, add imports:
import { Testimonials } from './src/components/sections/Testimonials';
import { Certifications } from './src/components/sections/Certifications';

// Add to main layout:
<Testimonials />
<Certifications />
```

## 📄 Updating the résumé

```bash
./infra/resume.sh ~/Documents/personal/Resume/Robel-Fekadu-Resume.pdf   # publish
./infra/resume.sh --status                                              # what's live
```

The PDF lives in a Vercel Blob store and `vercel.json` rewrites `/resume.pdf` to
it. A rewrite *proxies* rather than redirects, so the browser still sees a
same-origin `/resume.pdf` — which matters, because the `<a download>` attribute is
ignored cross-origin and the CSP is scoped to `'self'`. Uploading overwrites the
same pathname, so the public URL never changes and nothing is rebuilt; the
cache-control is 5 minutes, so a new version is live within that.

The script refuses anything that isn't a genuine, complete PDF — a broken résumé
link is worse than a stale one.

`public/resume.pdf` stays committed as a fallback: remove the rewrite and the
file is still there, so `/resume.pdf` keeps working either way.

**One-time setup** (see the header of `infra/resume.sh`): create a Blob store in
*Vercel dashboard → Storage → Create Database → Blob*, connect it to the project,
then run `vercel link` once from this directory. Until that exists the résumé is
served from the committed file, and updating it means editing that file and
letting Vercel redeploy.

## 🔧 Configuration

- **Theme:** Modify `src/context/ThemeContext.tsx`
- **Styling:** Customize colors in `tailwind.config.js`
- **SEO:** Update meta tags in `index.html`
- **Build:** Configure `vite.config.ts`

## 📝 Scripts

```bash
npm run dev        # Start development server
npm run build      # Typecheck, then build for production
npm run preview    # Preview production build
npm run lint       # ESLint (zero warnings allowed)
npm run typecheck  # tsc --noEmit
npm test           # Vitest, single run
npm run test:watch # Vitest in watch mode
npm run format     # Prettier
```

Requires Node >= 20 (see `.nvmrc`); the test environment needs it.

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📄 License

MIT - see [LICENSE](./LICENSE).

## 🤝 Contributing

This is a personal portfolio, but suggestions and improvements are welcome via issues or pull requests.

## 📧 Contact

- **Email:** contact@robelfekadu.com
- **LinkedIn:** [robavelii](https://www.linkedin.com/in/robavelii)
- **GitHub:** [robavelii](https://github.com/robavelii)

---

Built with ❤️ using React, TypeScript, and Tailwind CSS

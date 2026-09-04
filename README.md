# Robel Fekadu - Portfolio Website

A modern, high-performance portfolio website built with React, TypeScript, and Tailwind CSS, showcasing systems engineering expertise and projects.

## 🚀 Features

- **Dark/Light Mode** - Seamless theme switching with system preference detection
- **Keyboard Shortcuts** - Press `Ctrl/Cmd + K` to toggle theme (desktop only)
- **Interactive Components** - Terminal-style skill display and architecture diagrams
- **8 Featured Projects** - Comprehensive project showcase with technical details
- **Responsive Design** - Optimized for all screen sizes
- **SEO Optimized** - Comprehensive meta tags, Open Graph, and Twitter Cards
- **Accessibility** - WCAG compliant with skip-to-content links and ARIA labels
- **Performance** - Built with Vite for lightning-fast builds and HMR

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
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

- `Ctrl + K` (Windows/Linux) or `Cmd + K` (Mac) - Toggle dark/light mode

## 🎨 Customization

### Update Personal Information

1. **Profile Image:** Replace `/public/robel-fekadu.jpg` with your photo
2. **Resume:** Add your PDF resume to `/public/resume.pdf`
3. **Email:** Update email addresses in:
   - `App.tsx` (footer)
   - `src/components/sections/Contact.tsx`
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

## 🔧 Configuration

- **Theme:** Modify `src/context/ThemeContext.tsx`
- **Styling:** Customize colors in `tailwind.config.js`
- **SEO:** Update meta tags in `index.html`
- **Build:** Configure `vite.config.ts`

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📄 License

MIT License - feel free to use this template for your own portfolio!

## 🤝 Contributing

This is a personal portfolio, but suggestions and improvements are welcome via issues or pull requests.

## 📧 Contact

- **Email:** contact@robelfekadu.com
- **LinkedIn:** [robavelii](https://www.linkedin.com/in/robavelii)
- **GitHub:** [robavelii](https://github.com/robavelii)

---

Built with ❤️ using React, TypeScript, and Tailwind CSS

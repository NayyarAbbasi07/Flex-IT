# Flex it! — Curated Fashion

Premium curated imported thrift fashion storefront.

**Live:** https://flex-it-store.pages.dev

## Stack

- Next.js 16 (static export)
- React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide Icons
- Cloudflare Pages (CDN, HTTPS, compression)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | International WhatsApp number (no `+` or spaces) |

Also edit brand defaults in `src/lib/config.ts`.

## Deploy (Cloudflare Pages)

```bash
npm run pages:deploy
```

Or connect this GitHub repo in the Cloudflare dashboard:

- **Framework preset:** None (static)
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Root directory:** `/`

## Central configuration

All brand settings live in **`src/lib/config.ts`**:

- Brand name & tagline
- WhatsApp number
- Contact email / phone
- Social links (Instagram, Facebook, TikTok)
- Navigation
- Currency

Products live in **`src/lib/data.ts`**.

## Adding product images

1. Put files in `public/products/` (example: `public/products/af1-1.jpg`)
2. Update the product in `src/lib/data.ts`:

```ts
images: [
  {
    src: "/products/af1-1.jpg",
    alt: "Nike Air Force 1 White",
    isPlaceholder: false,
  },
]
```

## Adding a logo

1. Add `public/logo.svg` (or `.png`)
2. Replace the text logo in `src/components/layout/Navbar.tsx` and `Footer.tsx` with `next/image`

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run build` | Production static build → `out/` |
| `npm run lint` | ESLint |
| `npm run pages:deploy` | Build + deploy to Cloudflare Pages |

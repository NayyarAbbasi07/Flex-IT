import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Syne } from "next/font/google";
import { siteConfig } from "@/lib/config";
import { themeInitScript } from "@/lib/theme-script";
import { SiteShell } from "@/components/layout/SiteShell";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getStoreSettings, loadCollections } from "@/lib/storefront";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Flex it",
    "thrift sneakers",
    "imported shoes",
    "curated fashion",
    "Nike",
    "Adidas",
    "New Balance",
    "HOKA",
    "Pakistan sneakers",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, collections] = await Promise.all([
    getStoreSettings(),
    loadCollections(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: settings.brandName || siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
    },
    sameAs: [settings.instagram, settings.facebook, settings.tiktok],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <Script
          id="flexit-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <Script
          id="flexit-json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-white dark:focus:bg-neutral-100 dark:focus:text-neutral-900"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <SiteShell
            whatsappNumber={settings.whatsappNumber}
            whatsappDefaultMessage={settings.whatsappDefaultMessage}
            footerSettings={{
              brandName: settings.brandName,
              tagline: settings.tagline,
              email: settings.email,
              phone: settings.phone,
              address: settings.address,
              whatsappNumber: settings.whatsappNumber,
              instagram: settings.instagram,
              facebook: settings.facebook,
              tiktok: settings.tiktok,
            }}
            footerCollections={collections
              .filter((c) => c.featured)
              .map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
          >
            {children}
          </SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}

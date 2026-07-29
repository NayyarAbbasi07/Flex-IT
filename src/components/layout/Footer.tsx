"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/icons/SocialIcons";

export type FooterCollection = {
  id: string;
  slug: string;
  name: string;
};

export type FooterSettings = {
  brandName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  whatsappNumber: string;
  instagram: string;
  facebook: string;
  tiktok: string;
};

interface FooterProps {
  settings: FooterSettings;
  collections: FooterCollection[];
}

export function Footer({ settings, collections }: FooterProps) {
  const year = new Date().getFullYear();
  const featuredCollections = collections.slice(0, 5);

  return (
    <footer className="border-t border-border bg-muted/40">
      <Container className="py-14 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="font-display text-2xl font-bold tracking-tight focus-ring rounded-sm"
            >
              {settings.brandName.includes("!") ? (
                <>
                  {settings.brandName.replace("!", "")}
                  <span className="text-foreground/40">!</span>
                </>
              ) : (
                settings.brandName
              )}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {settings.tagline}. Premium imported thrift fashion, curated with
              care for the style-obsessed.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white transition hover:border-foreground focus-ring"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white transition hover:border-foreground focus-ring"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white transition hover:border-foreground focus-ring"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
              <a
                href={getGeneralWhatsAppUrl(undefined, settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white transition hover:border-foreground focus-ring"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition hover:text-foreground focus-ring rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Collections
            </h3>
            <ul className="mt-4 space-y-2.5">
              {featuredCollections.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/collections/${c.slug}`}
                    className="text-sm text-muted-foreground transition hover:text-foreground focus-ring rounded-sm"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/collections"
                  className="text-sm font-medium text-foreground transition hover:opacity-70 focus-ring rounded-sm"
                >
                  View all →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="transition hover:text-foreground focus-ring rounded-sm"
                >
                  {settings.email}
                </a>
              </li>
              <li>{settings.phone}</li>
              <li>{settings.address}</li>
              <li>
                <a
                  href={getGeneralWhatsAppUrl(undefined, settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground transition hover:opacity-70 focus-ring rounded-sm"
                >
                  WhatsApp us →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.brandName}. All rights reserved.
          </p>
          <p className="text-xs uppercase tracking-[0.18em]">
            Curated · Quality Checked · Nationwide Delivery
          </p>
        </div>
      </Container>
    </footer>
  );
}

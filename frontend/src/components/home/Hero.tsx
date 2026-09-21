"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/types";
import { siteConfig } from "@/lib/config";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroShoeRotator } from "@/components/home/HeroShoeRotator";

interface HeroProps {
  shoes: Product[];
  heading?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  brandName?: string;
}

export function Hero({
  shoes,
  heading = "Curated Fashion.",
  description = "Imported Premium Thrift Sneakers Curated For Every Style.",
  primaryCtaText = "Shop Collection",
  primaryCtaHref = "/shop",
  secondaryCtaText = "Contact on WhatsApp",
  whatsappNumber,
  whatsappMessage,
  brandName = siteConfig.name,
}: HeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[image:var(--gradient-mesh)]">
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-90" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(10,10,10,0.04),transparent_55%)]"
        aria-hidden
      />

      <Container className="relative flex min-h-[100svh] flex-col justify-center gap-12 py-28 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-32">
        <div className="max-w-xl shrink-0 lg:max-w-2xl">
          <p className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {brandName}
          </p>

          {heading && heading.trim().toLowerCase() !== brandName.trim().toLowerCase() && (
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground/90 sm:mt-5 sm:text-3xl md:text-4xl">
              {heading}
            </h1>
          )}

          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link href={primaryCtaHref} className="focus-ring rounded-xl">
              <Button size="lg" className="w-full sm:w-auto">
                {primaryCtaText}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
            <a
              href={getGeneralWhatsAppUrl(whatsappMessage, whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-xl"
            >
              <Button variant="outline" size="lg" className="w-full bg-card/70 sm:w-auto">
                <MessageCircle className="h-4 w-4" aria-hidden />
                {secondaryCtaText}
              </Button>
            </a>
          </motion.div>
        </div>

        <div className="w-full max-w-lg self-center lg:max-w-xl lg:flex-1">
          <HeroShoeRotator shoes={shoes} />
        </div>
      </Container>
    </section>
  );
}

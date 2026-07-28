"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[image:var(--gradient-mesh)]">
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-80" aria-hidden />

      {/* Full-bleed visual plane */}
      <div className="absolute inset-0">
        <PlaceholderImage
          image={{
            src: "",
            alt: "Flex it! curated premium sneakers",
            isPlaceholder: true,
            placeholderHue: 0,
          }}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full opacity-60"
          imageClassName="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/20 sm:via-white/70 sm:to-transparent"
          aria-hidden
        />
      </div>

      <Container className="relative flex min-h-[100svh] flex-col justify-end pb-16 pt-28 sm:justify-center sm:pb-24 sm:pt-32">
        <div className="max-w-2xl">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {siteConfig.name}
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground/90 sm:mt-5 sm:text-3xl md:text-4xl"
          >
            Curated Fashion.
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Imported Premium Thrift Sneakers Curated For Every Style.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link href="/shop" className="focus-ring rounded-xl">
              <Button size="lg" className="w-full sm:w-auto">
                Shop Collection
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-xl"
            >
              <Button variant="outline" size="lg" className="w-full bg-white/70 sm:w-auto">
                <MessageCircle className="h-4 w-4" aria-hidden />
                Contact on WhatsApp
              </Button>
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

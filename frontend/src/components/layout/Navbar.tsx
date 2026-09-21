"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { useWhatsAppSettings } from "@/components/providers/WhatsAppSettingsProvider";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CartButton } from "@/components/cart/CartDrawer";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { number, defaultMessage } = useWhatsAppSettings();
  const whatsappUrl = getGeneralWhatsAppUrl(defaultMessage, number);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-border/80 bg-card/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight focus-ring rounded-sm sm:text-2xl"
          onClick={() => setOpen(false)}
        >
          Flex it<span className="text-foreground/40">!</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {siteConfig.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground focus-ring rounded-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <CartButton />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex focus-ring rounded-xl"
          >
            <Button variant="whatsapp" size="sm">
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp
            </Button>
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/60 text-foreground transition hover:bg-muted focus-ring lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-card lg:hidden"
          >
            <nav
              className="flex flex-col gap-1 px-4 py-4 sm:px-6"
              aria-label="Mobile"
            >
              {siteConfig.nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium transition hover:bg-muted focus-ring"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 focus-ring rounded-xl"
                onClick={() => setOpen(false)}
              >
                <Button variant="whatsapp" fullWidth>
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Chat on WhatsApp
                </Button>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

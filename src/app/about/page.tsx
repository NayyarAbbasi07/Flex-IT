import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the Flex it! story — premium curated imported thrift fashion, quality-checked and delivered nationwide.",
};

export default function AboutPage() {
  return (
    <div className="pb-20 pt-28 md:pb-28 md:pt-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Our Story
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            About Flex it!
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Premium imported thrift fashion, curated with the care of a luxury
            sneaker boutique.
          </p>
        </div>

        <div className="relative mx-auto mt-14 aspect-[21/9] max-w-5xl overflow-hidden rounded-3xl border border-border bg-muted">
          <PlaceholderImage
            image={{
              src: "",
              alt: "Flex it! studio atmosphere",
              isPlaceholder: true,
              placeholderHue: 0,
            }}
            fill
            sizes="100vw"
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div className="mx-auto mt-14 max-w-2xl space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>
            Flex it! exists for people who love sneakers, streetwear, and
            fashion — and want imported pieces without settling for chaotic
            thrift piles or inflated retail prices.
          </p>
          <p>
            We quality-check every pair, grade condition honestly, and present
            each product with the clarity you&apos;d expect from Nike, Adidas,
            or StockX-level browsing — while staying uniquely Flex it!
          </p>
          <p>
            Affordable premium fashion. Nationwide delivery. A curated selection
            that grows with you — starting with shoes, expanding into clothing,
            jackets, hoodies, accessories, bags, and caps.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Premium imported thrift fashion",
            "Quality checked",
            "Curated selection",
            "Nationwide delivery",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border bg-muted/40 px-5 py-6 text-center"
            >
              <p className="font-display text-sm font-semibold tracking-tight sm:text-base">
                {item}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/shop" className="w-full sm:w-auto focus-ring rounded-xl">
            <Button size="lg" fullWidth className="sm:w-auto">
              Shop the collection
            </Button>
          </Link>
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto focus-ring rounded-xl"
          >
            <Button variant="outline" size="lg" fullWidth className="sm:w-auto">
              <MessageCircle className="h-4 w-4" aria-hidden />
              Chat with us
            </Button>
          </a>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Questions? Reach us at{" "}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="font-medium text-foreground underline-offset-4 hover:underline focus-ring rounded-sm"
          >
            {siteConfig.contact.email}
          </a>
        </p>
      </Container>
    </div>
  );
}

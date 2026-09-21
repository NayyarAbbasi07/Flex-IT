import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

interface CTAProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export function CTA({ whatsappNumber, whatsappMessage }: CTAProps) {
  return (
    <AnimatedSection className="py-20 md:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-[image:var(--gradient-hero)] px-6 py-14 text-center sm:px-10 md:py-20">
          <div
            className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-mesh)] opacity-70"
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Ready to flex?
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-balance">
              Find your next pair.
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Browse the collection or message us on WhatsApp — we&apos;ll help
              you pick the perfect curated piece.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/shop" className="w-full sm:w-auto focus-ring rounded-xl">
                <Button size="lg" fullWidth className="sm:w-auto">
                  Shop now
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <a
                href={getGeneralWhatsAppUrl(whatsappMessage, whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto focus-ring rounded-xl"
              >
                <Button variant="outline" size="lg" fullWidth className="bg-card sm:w-auto">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </AnimatedSection>
  );
}

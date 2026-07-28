import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactContent } from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Flex it! on WhatsApp for product availability, sizing, and nationwide delivery.",
};

export default function ContactPage() {
  return (
    <div className="pb-20 pt-28 md:pb-28 md:pt-32">
      <Container>
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Get in touch
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Contact
          </h1>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Prefer WhatsApp? That&apos;s how most Flex it! orders happen — fast,
            personal, and clear.
          </p>
        </div>
        <ContactContent />
      </Container>
    </div>
  );
}

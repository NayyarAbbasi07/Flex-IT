import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading, AnimatedSection } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function AboutBrand() {
  return (
    <AnimatedSection className="py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-muted sm:aspect-[5/4] lg:aspect-[4/5]">
            <PlaceholderImage
              image={{
                src: "",
                alt: "Flex it! brand story",
                isPlaceholder: true,
                placeholderHue: 0,
              }}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="About Flex it!"
              description="We're building Pakistan's most trusted destination for curated imported thrift fashion."
              className="mb-6 md:mb-8"
            />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Flex it! started with a simple obsession: premium sneakers
                deserve a premium presentation — even when they arrive through
                carefully curated thrift channels.
              </p>
              <p>
                Every piece is quality-checked, honestly graded, and selected for
                style longevity. We believe imported thrift fashion can feel as
                elevated as a flagship store experience.
              </p>
              <p>
                Today we focus on shoes. Tomorrow: clothing, jackets, hoodies,
                accessories, bags, and caps — same curation standard, same Flex
                it! DNA.
              </p>
            </div>
            <Link href="/about" className="mt-8 inline-flex focus-ring rounded-xl">
              <Button variant="outline">Read our story</Button>
            </Link>
          </div>
        </div>
      </Container>
    </AnimatedSection>
  );
}

import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import { SectionHeading, AnimatedSection } from "@/components/ui/SectionHeading";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { InstagramIcon } from "@/components/icons/SocialIcons";

const gallery = [
  { src: "/products/ig-1.jpg", alt: "Flex it curated white sneakers" },
  { src: "/products/ig-2.jpg", alt: "Flex it Jordan style pair" },
  { src: "/products/ig-3.jpg", alt: "Flex it classic skate sneakers" },
  { src: "/products/ig-4.jpg", alt: "Flex it premium runners" },
  { src: "/products/ig-5.jpg", alt: "Flex it black and white dunks" },
  { src: "/products/ig-6.jpg", alt: "Flex it high top canvas" },
];

export function InstagramGallery() {
  return (
    <AnimatedSection className="bg-muted/40 py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Social"
          title="Instagram Gallery"
          description="A glimpse of the Flex it! aesthetic. Real feed coming soon."
          action={
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold transition hover:opacity-70 focus-ring rounded-sm"
            >
              <InstagramIcon className="h-4 w-4" />
              Follow us
            </a>
          }
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {gallery.map((item) => (
            <a
              key={item.alt}
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl border border-border focus-ring"
            >
              <PlaceholderImage
                image={{
                  src: item.src,
                  alt: item.alt,
                  isPlaceholder: false,
                }}
                fill
                zoomOnHover
                sizes="(max-width: 640px) 50vw, 33vw"
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/30 group-hover:opacity-100">
                <InstagramIcon className="h-6 w-6 text-white" />
              </div>
            </a>
          ))}
        </div>
      </Container>
    </AnimatedSection>
  );
}

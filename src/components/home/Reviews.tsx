"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { reviews } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading, AnimatedSection } from "@/components/ui/SectionHeading";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-foreground text-foreground" : "text-border-strong"
          }`}
        />
      ))}
    </div>
  );
}

export function Reviews() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const visible = 3;

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const getVisible = () => {
    const items = [];
    for (let i = 0; i < visible; i++) {
      items.push(reviews[(index + i) % reviews.length]);
    }
    return items;
  };

  return (
    <AnimatedSection className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Social Proof"
          title="Customer Reviews"
          description="Real feedback from people who shop Flex it! for curated imported kicks."
          action={
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous reviews"
                onClick={() =>
                  setIndex((i) => (i - 1 + reviews.length) % reviews.length)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white transition hover:border-foreground focus-ring"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next reviews"
                onClick={() => setIndex((i) => (i + 1) % reviews.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white transition hover:border-foreground focus-ring"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {getVisible().map((review) => (
              <motion.blockquote
                key={`${review.id}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <Stars rating={review.rating} />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80 sm:text-base">
                  “{review.comment}”
                </p>
                <footer className="mt-6 border-t border-border pt-4">
                  <cite className="not-italic font-semibold">{review.name}</cite>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[review.location, review.productName]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </footer>
              </motion.blockquote>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </AnimatedSection>
  );
}

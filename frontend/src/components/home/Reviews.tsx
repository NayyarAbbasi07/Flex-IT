"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Review } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading, AnimatedSection } from "@/components/ui/SectionHeading";
import { ReviewSubmitForm } from "@/components/home/ReviewSubmitForm";

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-foreground text-foreground" : "text-border-strong"
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function Reviews({ items }: { items: Review[] }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const visible = Math.min(3, items.length);

  useEffect(() => {
    if (reduceMotion || items.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(id);
  }, [reduceMotion, items.length]);

  const getVisible = () => {
    const out = [];
    for (let i = 0; i < visible; i++) {
      out.push(items[(index + i) % items.length]);
    }
    return out;
  };

  return (
    <AnimatedSection className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Social Proof"
          title="Customer Reviews"
          description="Real feedback from people who shop Flex it! for curated imported kicks."
          action={
            items.length > 1 ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous reviews"
                  onClick={() =>
                    setIndex((i) => (i - 1 + items.length) % items.length)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition hover:border-foreground focus-ring"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next reviews"
                  onClick={() => setIndex((i) => (i + 1) % items.length)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition hover:border-foreground focus-ring"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : undefined
          }
        />

        {items.length > 0 && (
          <div
            className={`grid gap-5 ${visible === 1 ? "mx-auto max-w-xl md:grid-cols-1" : "md:grid-cols-3"}`}
          >
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
        )}

        <ReviewSubmitForm />
      </Container>
    </AnimatedSection>
  );
}

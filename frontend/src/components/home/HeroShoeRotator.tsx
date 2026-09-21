"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/types";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { cn } from "@/lib/utils";

interface HeroShoeRotatorProps {
  shoes: Product[];
  intervalMs?: number;
  className?: string;
}

export function HeroShoeRotator({
  shoes,
  intervalMs = 3200,
  className,
}: HeroShoeRotatorProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || shoes.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % shoes.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, reduceMotion, shoes.length]);

  const shoe = shoes[index];
  if (!shoe) return null;

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-md lg:max-w-none",
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Soft stage glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.04] blur-3xl sm:h-80 sm:w-80"
        aria-hidden
      />

      <div className="relative aspect-square w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={shoe.id}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, rotate: -18, scale: 0.88, y: 24 }
            }
            animate={{ opacity: 1, rotate: -8, scale: 1, y: 0 }}
            exit={
              reduceMotion
                ? undefined
                : { opacity: 0, rotate: 12, scale: 0.9, y: -20 }
            }
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, -10, 0],
                      rotate: [-8, -5, -8],
                    }
              }
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative h-full w-full overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 shadow-lg backdrop-blur-sm"
            >
              <PlaceholderImage
                image={shoe.images[0]}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="absolute inset-0 h-full w-full"
                imageClassName="object-cover"
              />

              {/* Subtle shoe silhouette cue for placeholders */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/[0.06] to-transparent"
                aria-hidden
              />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {shoe.brand}
                </p>
                <p className="mt-1 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {shoe.name}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {shoes.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${item.brand} ${item.name}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 focus-ring",
              i === index
                ? "w-7 bg-foreground"
                : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}

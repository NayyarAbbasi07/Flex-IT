"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { Product } from "@/types";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const images = product.images;

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-muted sm:rounded-3xl",
          zoomed && "cursor-zoom-out"
        )}
      >
        <button
          type="button"
          className="absolute inset-0 z-10"
          aria-label={zoomed ? "Zoom out" : "Zoom in"}
          onClick={() => setZoomed((z) => !z)}
        />
        <PlaceholderImage
          image={images[active]}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="absolute inset-0 h-full w-full"
          imageClassName={cn(
            "transition-transform duration-500",
            zoomed ? "scale-150" : "scale-100"
          )}
        />
        <div className="pointer-events-none absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 text-foreground shadow-sm backdrop-blur">
          <ZoomIn className="h-4 w-4" />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 shadow-sm transition hover:bg-card focus-ring"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 shadow-sm transition hover:bg-card focus-ring"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {images.map((image, i) => (
            <button
              key={`${image.alt}-${i}`}
              type="button"
              onClick={() => {
                setActive(i);
                setZoomed(false);
              }}
              aria-label={`View image ${i + 1}`}
              aria-current={active === i}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border transition sm:h-24 sm:w-20 focus-ring",
                active === i
                  ? "border-foreground"
                  : "border-border hover:border-border-strong"
              )}
            >
              <PlaceholderImage
                image={image}
                fill
                sizes="80px"
                className="absolute inset-0 h-full w-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/types";

interface PlaceholderImageProps {
  image: ProductImage;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  zoomOnHover?: boolean;
}

/**
 * Drop-in image component. When `image.src` is empty or `isPlaceholder` is true,
 * renders a premium gradient placeholder. Swap in real paths later — layout stays intact.
 */
export function PlaceholderImage({
  image,
  fill,
  width,
  height,
  className,
  imageClassName,
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  zoomOnHover = false,
}: PlaceholderImageProps) {
  const [loaded, setLoaded] = useState(false);
  const hasRealImage = Boolean(image.src) && !image.isPlaceholder;
  const hue = image.placeholderHue ?? 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        zoomOnHover && "group",
        className
      )}
    >
      {hasRealImage ? (
        <>
          {!loaded && <div className="absolute inset-0 skeleton" aria-hidden />}
          <Image
            src={image.src}
            alt={image.alt}
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            priority={priority}
            sizes={sizes}
            loading={priority ? undefined : "lazy"}
            onLoad={() => setLoaded(true)}
            className={cn(
              "object-cover transition-transform duration-700 ease-out",
              zoomOnHover && "group-hover:scale-105",
              loaded ? "opacity-100" : "opacity-0",
              imageClassName
            )}
          />
        </>
      ) : (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out",
            zoomOnHover && "group-hover:scale-105",
            imageClassName
          )}
          style={{
            background: `
              radial-gradient(circle at 30% 20%, hsla(${hue}, 8%, 92%, 1), transparent 50%),
              radial-gradient(circle at 70% 80%, hsla(${hue}, 6%, 88%, 1), transparent 45%),
              linear-gradient(145deg, #f7f7f7 0%, #ebebeb 50%, #f3f3f3 100%)
            `,
          }}
          role="img"
          aria-label={image.alt}
        >
          <div className="flex flex-col items-center gap-2 px-4 text-center opacity-40">
            <div
              className="h-16 w-16 rounded-full border border-foreground/10 sm:h-20 sm:w-20"
              style={{
                background: `linear-gradient(135deg, hsla(${hue}, 10%, 70%, 0.25), hsla(${hue}, 5%, 50%, 0.1))`,
              }}
            />
            <span className="max-w-[12rem] text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/50 sm:text-xs">
              Image coming soon
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

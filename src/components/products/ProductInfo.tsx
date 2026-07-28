"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import type { Product } from "@/types";
import { CONDITION_LABELS } from "@/lib/config";
import { formatPrice, cn } from "@/lib/utils";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [size, setSize] = useState(product.sizes[0] || "");
  const isSold = product.availability === "sold";
  const isReserved = product.availability === "reserved";

  const whatsappUrl = getProductWhatsAppUrl({
    productName: `${product.brand} ${product.name}`,
    size,
    price: formatPrice(product.price),
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-2">
        {product.featured && <Badge>Featured</Badge>}
        {product.availability === "available" && (
          <Badge variant="success">Available</Badge>
        )}
        {isReserved && <Badge variant="warning">Reserved</Badge>}
        {isSold && <Badge variant="muted">Sold</Badge>}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {product.brand}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {product.name}
      </h1>

      <div className="mt-5 flex items-baseline gap-3">
        <p className="font-display text-3xl font-bold">{formatPrice(product.price)}</p>
        {product.compareAtPrice && (
          <p className="text-lg text-muted-foreground line-through">
            {formatPrice(product.compareAtPrice)}
          </p>
        )}
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Condition</dt>
          <dd className="mt-1 font-semibold">{CONDITION_LABELS[product.condition]}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Color</dt>
          <dd className="mt-1 font-semibold">{product.color}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Category</dt>
          <dd className="mt-1 font-semibold capitalize">{product.category}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Availability</dt>
          <dd className="mt-1 font-semibold capitalize">{product.availability}</dd>
        </div>
      </dl>

      <div className="mt-8">
        <p className="mb-3 text-sm font-semibold">Select size (EU)</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-medium transition focus-ring",
                size === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-white hover:border-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {product.description}
      </p>

      <div className="mt-8 hidden gap-3 sm:flex">
        {isSold ? (
          <Button size="lg" disabled fullWidth>
            Sold Out
          </Button>
        ) : (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full focus-ring rounded-xl"
          >
            <Button variant="whatsapp" size="lg" fullWidth>
              <MessageCircle className="h-5 w-5" aria-hidden />
              Buy on WhatsApp
            </Button>
          </a>
        )}
      </div>

      {/* Sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 p-3 backdrop-blur-md sm:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{product.name}</p>
            <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
          </div>
          {isSold ? (
            <Button disabled size="md">
              Sold Out
            </Button>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-xl"
            >
              <Button variant="whatsapp" size="md">
                <MessageCircle className="h-4 w-4" aria-hidden />
                Buy Now
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

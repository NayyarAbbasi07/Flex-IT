"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { CONDITION_LABELS } from "@/lib/config";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority, className }: ProductCardProps) {
  const { addItem } = useCart();
  const primaryImage = product.images[0];
  const isSold = product.availability === "sold";
  const isReserved = product.availability === "reserved";
  const firstAvailableSize =
    product.inventory?.find((row) => row.available)?.size ||
    (product.availability !== "sold" ? product.sizes[0] : undefined);

  const onAddToCart = () => {
    if (isSold || !firstAvailableSize) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      sku: product.sku,
      size: firstAvailableSize,
      price: product.price,
      condition: CONDITION_LABELS[product.condition],
      image: primaryImage?.src,
    });
  };

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500",
        "hover:border-border-strong hover:shadow-md",
        className
      )}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
      >
        <PlaceholderImage
          image={primaryImage}
          fill
          priority={priority}
          zoomOnHover
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.featured && <Badge>Featured</Badge>}
          {isSold && <Badge variant="muted">Sold</Badge>}
          {isReserved && <Badge variant="warning">Reserved</Badge>}
          {product.availability === "available" && (
            <Badge variant="success">Available</Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {product.brand}
          </p>
          <Link href={`/shop/${product.slug}`} className="focus-ring rounded-sm">
            <h3 className="font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-foreground/80 sm:text-xl">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>Size {product.sizes.join(", ")}</span>
          <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden />
          <span>{CONDITION_LABELS[product.condition]}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="font-display text-xl font-bold tracking-tight">
              {formatPrice(product.price)}
            </p>
            {product.compareAtPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link href={`/shop/${product.slug}`} className="focus-ring rounded-xl">
            <Button variant="outline" size="sm" fullWidth className="w-full">
              View
            </Button>
          </Link>
          {isSold || !firstAvailableSize ? (
            <Button variant="secondary" size="sm" disabled fullWidth>
              Sold Out
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              className="w-full"
              onClick={onAddToCart}
              title={`Add EU ${firstAvailableSize} — change size on product page`}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              Add
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

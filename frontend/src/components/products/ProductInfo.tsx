"use client";

import { useMemo, useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import type { Product, SizeInventory } from "@/types";
import { CONDITION_LABELS } from "@/lib/config";
import { formatPrice, cn } from "@/lib/utils";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";
import { logWhatsAppInquiry } from "@/lib/log-inquiry";
import { useWhatsAppSettings } from "@/components/providers/WhatsAppSettingsProvider";
import { useCart } from "@/components/providers/CartProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductInfoProps {
  product: Product;
  /** Optional override; defaults to CMS WhatsApp number from layout. */
  whatsappNumber?: string;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function resolveInventory(product: Product): SizeInventory[] {
  if (product.inventory?.length) return product.inventory;
  return product.sizes.map((size) => ({
    size,
    quantity: product.availability === "sold" ? 0 : 1,
    available: product.availability !== "sold",
  }));
}

export function ProductInfo({ product, whatsappNumber }: ProductInfoProps) {
  const { number: cmsNumber } = useWhatsAppSettings();
  const { addItem } = useCart();
  const inventory = useMemo(() => resolveInventory(product), [product]);
  const firstAvailable = inventory.find((row) => row.available)?.size || "";
  const [size, setSize] = useState(firstAvailable);
  const [addedFlash, setAddedFlash] = useState(false);
  const selected = inventory.find((row) => row.size === size);
  const isSold =
    product.availability === "sold" || inventory.every((row) => !row.available);
  const isReserved = product.availability === "reserved";
  const sizeUnavailable = Boolean(size) && selected && !selected.available;
  const canBuy = !isSold && !sizeUnavailable && Boolean(size);

  const whatsappUrl = getProductWhatsAppUrl(
    {
      productName: `${product.brand} ${product.name}`,
      slug: product.slug,
      sku: product.sku,
      size,
      price: formatPrice(product.price),
      condition: CONDITION_LABELS[product.condition],
    },
    { number: whatsappNumber || cmsNumber }
  );

  const onBuyClick = () => {
    logWhatsAppInquiry({
      productId: UUID_RE.test(product.id) ? product.id : undefined,
      size: size || undefined,
      message: `WhatsApp Buy: ${product.brand} ${product.name}${size ? ` · EU ${size}` : ""}${product.sku ? ` · ${product.sku}` : ""}`,
    });
  };

  const onAddToCart = () => {
    if (!canBuy || !size) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      sku: product.sku,
      size,
      price: product.price,
      condition: CONDITION_LABELS[product.condition],
      image: product.images[0]?.src,
    });
    setAddedFlash(true);
    window.setTimeout(() => setAddedFlash(false), 1600);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-2">
        {product.featured && <Badge>Featured</Badge>}
        {!isSold && product.availability === "available" && (
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
          <dd className="mt-1 font-semibold capitalize">
            {isSold ? "sold" : product.availability}
          </dd>
        </div>
      </dl>

      <div className="mt-8">
        <p className="mb-3 text-sm font-semibold">Select size (EU)</p>
        <div className="flex flex-wrap gap-2">
          {inventory.map((row) => {
            const out = !row.available;
            return (
              <button
                key={row.size}
                type="button"
                disabled={out}
                onClick={() => setSize(row.size)}
                title={out ? "Out of Stock" : undefined}
                aria-label={
                  out ? `EU ${row.size} out of stock` : `Select EU ${row.size}`
                }
                className={cn(
                  "relative flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-medium transition focus-ring",
                  out &&
                    "cursor-not-allowed border-border/60 bg-muted text-muted-foreground line-through opacity-60",
                  !out &&
                    size === row.size &&
                    "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900",
                  !out &&
                    size !== row.size &&
                    "border-border bg-card hover:border-foreground"
                )}
              >
                {row.size}
              </button>
            );
          })}
        </div>
        {sizeUnavailable && (
          <p className="mt-2 text-sm text-muted-foreground">Out of Stock</p>
        )}
        {selected?.lowStock && selected.available && (
          <p className="mt-2 text-sm text-warning">Only a few left in this size</p>
        )}
      </div>

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {product.description}
      </p>

      <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-2">
        {canBuy ? (
          <>
            <Button size="lg" fullWidth onClick={onAddToCart}>
              <ShoppingBag className="h-5 w-5" aria-hidden />
              {addedFlash ? "Added" : "Add to bag"}
            </Button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full focus-ring rounded-xl"
              onClick={onBuyClick}
            >
              <Button variant="whatsapp" size="lg" fullWidth>
                <MessageCircle className="h-5 w-5" aria-hidden />
                Buy now
              </Button>
            </a>
          </>
        ) : (
          <Button size="lg" disabled fullWidth className="sm:col-span-2">
            {isSold ? "Sold Out" : "Select an available size"}
          </Button>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur-md sm:hidden">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{product.name}</p>
            <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
          </div>
          {canBuy ? (
            <>
              <Button size="md" onClick={onAddToCart} aria-label="Add to bag">
                <ShoppingBag className="h-4 w-4" />
              </Button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded-xl"
                onClick={onBuyClick}
              >
                <Button variant="whatsapp" size="md">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Buy
                </Button>
              </a>
            </>
          ) : (
            <Button disabled size="md">
              Sold Out
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

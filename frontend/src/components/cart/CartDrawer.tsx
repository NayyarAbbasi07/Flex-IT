"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/components/providers/CartProvider";
import { useWhatsAppSettings } from "@/components/providers/WhatsAppSettingsProvider";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { mediaUrl } from "@/lib/api-client";
import { getCartWhatsAppUrl } from "@/lib/whatsapp";
import { logWhatsAppInquiry } from "@/lib/log-inquiry";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function CartDrawer() {
  const {
    items,
    count,
    total,
    open,
    setOpen,
    removeItem,
    updateQuantity,
    clear,
  } = useCart();
  const { number } = useWhatsAppSettings();
  const reduceMotion = useReducedMotion();
  const whatsappUrl = getCartWhatsAppUrl(items, { number });

  const onCheckout = () => {
    if (!items.length) return;
    const names = items
      .map((item) => `${item.brand} ${item.name} EU${item.size}`)
      .join("; ");
    logWhatsAppInquiry({
      productId: UUID_RE.test(items[0].productId) ? items[0].productId : undefined,
      size: items[0].size,
      message: `WhatsApp Cart (${count}): ${names}`,
    });
    clear();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[60] bg-black/40"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-border bg-card text-foreground shadow-lg"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight">Your bag</h2>
                <p className="text-xs text-muted-foreground">
                  {count} item{count === 1 ? "" : "s"} · checkout on WhatsApp
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border transition hover:bg-muted focus-ring"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
                  <p className="font-medium">Your bag is empty</p>
                  <p className="max-w-xs text-sm text-muted-foreground">
                    Add shoes from the shop, then send everything to WhatsApp in one message.
                  </p>
                  <Link href="/shop" onClick={() => setOpen(false)} className="focus-ring rounded-xl">
                    <Button variant="outline">Browse shop</Button>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 border-b border-border pb-4 last:border-0"
                    >
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
                      >
                        {item.image ? (
                          <Image
                            src={mediaUrl(item.image)}
                            alt={`${item.brand} ${item.name}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            No img
                          </span>
                        )}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="block truncate font-semibold hover:underline"
                        >
                          {item.brand} {item.name}
                        </Link>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          EU {item.size}
                          {item.condition ? ` · ${item.condition}` : ""}
                        </p>
                        <p className="mt-1 font-display font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="inline-flex items-center rounded-lg border border-border">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              className="flex h-8 w-8 items-center justify-center hover:bg-muted focus-ring"
                              onClick={() =>
                                item.quantity <= 1
                                  ? removeItem(item.id)
                                  : updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              className="flex h-8 w-8 items-center justify-center hover:bg-muted focus-ring"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            aria-label="Remove item"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-danger focus-ring"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="space-y-3 border-t border-border px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated total</span>
                  <span className="font-display text-lg font-bold">{formatPrice(total)}</span>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus-ring rounded-xl"
                  onClick={onCheckout}
                >
                  <Button variant="whatsapp" size="lg" fullWidth>
                    <MessageCircle className="h-5 w-5" aria-hidden />
                    Order all on WhatsApp
                  </Button>
                </a>
                <button
                  type="button"
                  onClick={clear}
                  className="w-full text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
                >
                  Clear bag
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function CartButton({ className }: { className?: string }) {
  const { count, ready, setOpen } = useCart();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={ready ? `Open cart, ${count} items` : "Open cart"}
      className={
        className ||
        "relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/60 text-foreground transition hover:bg-muted focus-ring"
      }
    >
      <ShoppingBag className="h-4 w-4" />
      {ready && count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-bold text-white dark:bg-neutral-100 dark:text-neutral-900">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

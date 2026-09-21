/** Fire-and-forget WhatsApp lead logging for admin Inquiries. */

export type WhatsAppInquiryPayload = {
  productId?: string;
  size?: string;
  name?: string;
  phone?: string;
  message?: string;
  source?: "WHATSAPP" | "WEB";
};

/**
 * Best-effort inquiry create. Never blocks the WhatsApp open flow.
 * Uses a guest name/phone placeholder when the shopper only clicked Buy.
 */
export function logWhatsAppInquiry(payload: WhatsAppInquiryPayload) {
  const body = {
    productId: payload.productId || null,
    size: payload.size || null,
    name: payload.name?.trim() || "WhatsApp visitor",
    phone: payload.phone?.trim() || "pending-on-whatsapp",
    message:
      payload.message ||
      "Customer opened WhatsApp Buy with prefilled product details.",
    source: payload.source || "WHATSAPP",
  };

  // Prefer Next rewrite /api → backend so cookies/CORS stay same-origin
  void fetch("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    /* ignore — WhatsApp handoff still proceeds */
  });
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader, Input, Textarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { adminJson } from "@/lib/admin-api";

export default function AdminWhatsAppPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappDefaultMessage, setMessage] = useState("");
  const [businessHours, setHours] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminJson<Record<string, string>>("/api/settings/manage").then(({ json }) => {
      setWhatsappNumber(json.data?.whatsappNumber || "");
      setMessage(json.data?.whatsappDefaultMessage || "");
      setHours(json.data?.businessHours || "");
      setPhone(json.data?.phone || "");
    });
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await adminJson("/api/settings", {
      method: "PUT",
      body: JSON.stringify({
        whatsappNumber,
        whatsappDefaultMessage,
        businessHours,
        phone,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="WhatsApp settings"
        description="This number is used by every Buy / Cart / Chat button on the storefront. The default message is for general chats only — product Buy and multi-item bag checkout send a dedicated order message with size, price, and product links."
      />
      <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-5">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">WhatsApp number (digits only, with country code)</span>
          <Input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="923330215663" />
          <span className="mt-1.5 block text-xs text-muted-foreground">
            Used on product Buy buttons, navbar, footer, hero, and contact.
          </span>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Display phone</span>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Business hours</span>
          <Input value={businessHours} onChange={(e) => setHours(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Default message (general chat)</span>
          <Textarea rows={5} value={whatsappDefaultMessage} onChange={(e) => setMessage(e.target.value)} />
          <span className="mt-1.5 block text-xs text-muted-foreground">
            Opens when visitors tap WhatsApp in the navbar, hero, or contact — not on product Buy.
          </span>
        </label>
        <Button type="submit">{saved ? "Saved" : "Save WhatsApp settings"}</Button>
      </form>
    </>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader, Input, Textarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

export default function AdminWhatsAppPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappDefaultMessage, setMessage] = useState("");
  const [businessHours, setHours] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((j) => {
        setWhatsappNumber(j.data?.whatsappNumber || "");
        setMessage(j.data?.whatsappDefaultMessage || "");
        setHours(j.data?.businessHours || "");
        setPhone(j.data?.phone || "");
      });
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
        description="Buy buttons on the storefront use this number automatically."
      />
      <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-2xl border border-border bg-white p-5">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">WhatsApp number (digits only, with country code)</span>
          <Input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="923330215663" />
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
          <span className="mb-1.5 block font-medium">Default message</span>
          <Textarea rows={5} value={whatsappDefaultMessage} onChange={(e) => setMessage(e.target.value)} />
        </label>
        <Button type="submit">{saved ? "Saved" : "Save WhatsApp settings"}</Button>
      </form>
    </>
  );
}

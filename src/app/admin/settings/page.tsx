"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader, Input, Textarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import type { StoreSettingsMap } from "@/lib/settings";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Partial<StoreSettingsMap>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((j) => setForm(j.data || {}));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (key: keyof StoreSettingsMap, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <PageHeader title="Store settings" description="Brand identity, contact, and policies." />
      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-border bg-white p-5 md:grid-cols-2">
        {(
          [
            ["brandName", "Brand name"],
            ["tagline", "Tagline"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["address", "Address"],
            ["instagram", "Instagram URL"],
            ["facebook", "Facebook URL"],
            ["tiktok", "TikTok URL"],
            ["logoUrl", "Logo URL"],
            ["faviconUrl", "Favicon URL"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-sm">
            <span className="mb-1.5 block font-medium">{label}</span>
            <Input value={form[key] || ""} onChange={(e) => set(key, e.target.value)} />
          </label>
        ))}
        {(
          [
            ["shippingInfo", "Shipping information"],
            ["returnPolicy", "Return policy"],
            ["privacyPolicy", "Privacy policy"],
            ["termsConditions", "Terms & conditions"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-sm md:col-span-2">
            <span className="mb-1.5 block font-medium">{label}</span>
            <Textarea rows={3} value={form[key] || ""} onChange={(e) => set(key, e.target.value)} />
          </label>
        ))}
        <div className="md:col-span-2">
          <Button type="submit">{saved ? "Saved" : "Save settings"}</Button>
        </div>
      </form>
    </>
  );
}

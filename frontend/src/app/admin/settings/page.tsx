"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader, Input, Textarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import type { StoreSettingsMap } from "@/lib/storefront";
import { adminJson } from "@/lib/admin-api";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Partial<StoreSettingsMap>>({});
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    adminJson<Partial<StoreSettingsMap>>("/api/settings/manage").then(({ json }) =>
      setForm(json.data || {})
    );
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await adminJson("/api/settings", {
      method: "PUT",
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setPasswordSaving(true);
    const { res, json } = await adminJson("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setPasswordSaving(false);

    if (!res.ok) {
      setPasswordError(json.error || "Failed to change password");
      return;
    }

    setPasswordSuccess("Password updated");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const set = (key: keyof StoreSettingsMap, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <PageHeader title="Store settings" description="Brand identity, contact, and policies." />
      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-2">
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

      <form
        onSubmit={onChangePassword}
        className="mt-8 grid max-w-md gap-4 rounded-2xl border border-border bg-card p-5"
      >
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight">Change password</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update the password for your signed-in admin account.
          </p>
        </div>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Current password</span>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">New password</span>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Confirm new password</span>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>
        {passwordError ? <p className="text-sm text-red-600">{passwordError}</p> : null}
        {passwordSuccess ? <p className="text-sm text-green-700">{passwordSuccess}</p> : null}
        <div>
          <Button type="submit" disabled={passwordSaving}>
            {passwordSaving ? "Updating…" : "Update password"}
          </Button>
        </div>
      </form>
    </>
  );
}

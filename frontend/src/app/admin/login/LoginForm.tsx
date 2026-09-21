"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/admin/ui";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { apiSend } from "@/lib/api-client";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("admin@flexit.store");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await apiSend<{
      token: string;
      user: { id: string; email: string; name: string | null; role: string };
    }>("/api/auth/login", "POST", { email, password, remember });
    setLoading(false);
    if (!res.success) {
      setError("Invalid email or password");
      return;
    }
    router.push(params.get("callbackUrl") || "/admin");
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-md"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Flex it! CMS
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage products, inventory, and store settings.
        </p>

        <div className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Email</span>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Password</span>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Remember me
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth size="lg" className="mt-6" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Forgot password? Sign in with your current password, then change it under Admin → Settings.
        </p>
      </form>
    </div>
  );
}

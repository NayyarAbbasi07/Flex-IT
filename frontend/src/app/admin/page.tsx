"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminCard, PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { adminJson } from "@/lib/admin-api";

type Stats = {
  total: number;
  published: number;
  draft: number;
  featured: number;
  brands: number;
  categories: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
  inquiriesNew?: number;
  inquiriesTotal?: number;
  ordersPending?: number;
  ordersConfirmed?: number;
  ordersTotal?: number;
  recent: Array<{
    id: string;
    name: string;
    sku: string;
    status: string;
    brand: { name: string };
    createdAt: string;
  }>;
  byBrand: Array<{ name: string; count: number }>;
};

function DashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminJson<Stats>("/api/stats")
      .then(({ res, json }) => {
        if (!res.ok || !json.data) throw new Error(json.error || "Failed");
        setStats(json.data);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8">
        <p className="font-semibold">Could not load dashboard</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error}. Start Docker Postgres, run <code>npx prisma db push</code> and{" "}
          <code>npm run db:seed</code>, then restart the API.
        </p>
      </div>
    );
  }

  if (!stats) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Live inventory and WhatsApp ops for Flex it!"
        action={
          <Link href="/admin/products/new">
            <Button>Add product</Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminCard title="Total Products" value={stats.total} />
        <AdminCard title="In Stock" value={stats.inStock} hint="Has available sizes" />
        <AdminCard title="Out of Stock sizes" value={stats.outOfStock} />
        <AdminCard title="Low Stock Alert" value={stats.lowStock} hint="At/below lowStockAt" />
        <AdminCard title="Categories" value={stats.categories} />
        <AdminCard title="Brands" value={stats.brands} />
        <AdminCard title="New inquiries" value={stats.inquiriesNew ?? 0} />
        <AdminCard title="Pending orders" value={stats.ordersPending ?? 0} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Products by brand</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byBrand}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  stroke="var(--border)"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "var(--muted-foreground)" }}
                  stroke="var(--border)"
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                  }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Bar dataKey="count" fill="var(--foreground)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Recent products</h2>
          <ul className="mt-4 space-y-3">
            {stats.recent.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.brand.name} · {p.sku}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <AdminCard title="Inquiries" value={stats.inquiriesTotal ?? 0} hint="All time" />
        <AdminCard title="Orders" value={stats.ordersTotal ?? 0} hint="All time" />
        <AdminCard title="Confirmed orders" value={stats.ordersConfirmed ?? 0} />
      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-muted" />}>
      <DashboardContent />
    </Suspense>
  );
}

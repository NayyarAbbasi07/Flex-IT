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
    fetch("/api/admin/stats")
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || "Failed");
        setStats(json.data);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8">
        <p className="font-semibold">Could not load dashboard</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error}. Make sure the database is running and seeded.
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
        description="Live inventory overview for Flex it!"
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
        <AdminCard title="Low Stock Alert" value={stats.lowStock} hint="Qty 1–2" />
        <AdminCard title="Categories" value={stats.categories} />
        <AdminCard title="Brands" value={stats.brands} />
        <AdminCard title="Featured" value={stats.featured} />
        <AdminCard title="Drafts" value={stats.draft} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="font-display text-lg font-semibold">Products by brand</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byBrand}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0a0a0a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
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
        <AdminCard title="Visitors" value="—" hint="Future-ready analytics" />
        <AdminCard title="Orders" value="—" hint="Future-ready order module" />
        <AdminCard title="Revenue" value="—" hint="Future-ready payments" />
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

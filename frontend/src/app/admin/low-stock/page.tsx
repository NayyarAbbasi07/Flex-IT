"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { adminJson } from "@/lib/admin-api";

type LowStockRow = {
  inventoryId: string;
  productId: string;
  productName: string;
  sku: string;
  size: string;
  quantity: number;
  lowStockAt: number;
  status: string;
};

export default function AdminLowStockPage() {
  const [items, setItems] = useState<LowStockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminJson<LowStockRow[]>("/api/products/low-stock")
      .then(({ res, json }) => {
        if (!res.ok) {
          setError(json.error || "Failed to load low stock");
          return;
        }
        setItems(json.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        title="Low stock"
        description="Sizes at or below their low-stock threshold."
      />
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Qty</th>
              <th className="px-4 py-3 text-left">Low at</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No low-stock items
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.inventoryId} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{row.productName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.sku}</td>
                  <td className="px-4 py-3">{row.size}</td>
                  <td className="px-4 py-3 text-danger">{row.quantity}</td>
                  <td className="px-4 py-3">{row.lowStockAt}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold uppercase">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${row.productId}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHeader, Input, Select } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { adminJson } from "@/lib/admin-api";

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  price: number;
  status: string;
  featured: boolean;
  brand: { name: string };
  images: Array<{ url: string }>;
  inventory: Array<{ size: string; quantity: number }>;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    adminJson<ProductRow[]>(`/api/products/manage?${params}`)
      .then(({ json }) => setProducts(json.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await adminJson(`/api/products/id/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <PageHeader
        title="Products"
        description="Create, edit, and publish inventory."
        action={
          <Link href="/admin/products/new">
            <Button>Add product</Button>
          </Link>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search name, SKU, brand..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-44">
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </Select>
        <Button variant="outline" onClick={load}>
          Filter
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const stock = p.inventory.reduce((sum, i) => sum + i.quantity, 0);
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                            {p.images[0]?.url && (
                              <Image
                                src={p.images[0].url}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.brand.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                      <td className="px-4 py-3">{formatPrice(p.price)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            stock === 0
                              ? "text-danger"
                              : stock <= 4
                                ? "text-warning"
                                : "text-success"
                          }
                        >
                          {stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold uppercase">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="text-sm font-medium underline-offset-4 hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(p.id)}
                            className="text-sm font-medium text-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

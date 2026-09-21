"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader, Input, Textarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { adminJson } from "@/lib/admin-api";

type Brand = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  featured: boolean;
  _count?: { products: number };
};

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);

  const load = () =>
    adminJson<Brand[]>("/api/brands").then(({ json }) => setBrands(json.data || []));

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await adminJson("/api/brands", {
      method: "POST",
      body: JSON.stringify({ name, description, featured }),
    });
    setName("");
    setDescription("");
    setFeatured(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete brand?")) return;
    await adminJson(`/api/brands?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <PageHeader title="Brands" description="Manage Nike, Adidas, and more." />
      <form onSubmit={onSubmit} className="mb-8 grid gap-3 rounded-2xl border border-border bg-card p-5 md:grid-cols-4">
        <Input placeholder="Brand name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured
        </label>
        <Button type="submit">Add brand</Button>
      </form>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Products</th>
              <th className="px-4 py-3 text-left">Featured</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 py-3">{b._count?.products ?? 0}</td>
                <td className="px-4 py-3">{b.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <button type="button" className="text-danger" onClick={() => remove(b.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

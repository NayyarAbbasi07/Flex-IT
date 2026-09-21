"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader, Input } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { adminJson } from "@/lib/admin-api";

type Category = {
  id: string;
  name: string;
  enabled: boolean;
  _count?: { products: number };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  const load = () =>
    adminJson<Category[]>("/api/categories").then(({ json }) =>
      setCategories(json.data || [])
    );

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await adminJson("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    setName("");
    load();
  };

  const toggle = async (cat: Category) => {
    await adminJson("/api/categories", {
      method: "PUT",
      body: JSON.stringify({ id: cat.id, name: cat.name, enabled: !cat.enabled }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete category?")) return;
    await adminJson(`/api/categories?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <PageHeader title="Categories" description="Running, Lifestyle, Basketball, and more." />
      <form onSubmit={onSubmit} className="mb-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row">
        <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Button type="submit">Add category</Button>
      </form>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Products</th>
              <th className="px-4 py-3 text-left">Enabled</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c._count?.products ?? 0}</td>
                <td className="px-4 py-3">{c.enabled ? "Yes" : "No"}</td>
                <td className="px-4 py-3 space-x-3">
                  <button type="button" onClick={() => toggle(c)}>
                    {c.enabled ? "Disable" : "Enable"}
                  </button>
                  <button type="button" className="text-danger" onClick={() => remove(c.id)}>
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

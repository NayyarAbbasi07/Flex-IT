"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, PageHeader } from "@/components/admin/ui";
import { adminFetch, adminJson } from "@/lib/admin-api";

const SIZES = ["38", "39", "40", "41", "42", "43", "44", "45", "46"];
const SHOE_TYPES = [
  "Sneakers",
  "Running",
  "Casual",
  "Basketball",
  "Lifestyle",
  "Football",
  "Hiking",
];

type Brand = { id: string; name: string };
type Category = { id: string; name: string };

type ProductFormState = {
  name: string;
  sku: string;
  brandId: string;
  categoryId: string;
  gender: string;
  shoeType: string;
  condition: string;
  originalBrand: string;
  importedFrom: string;
  color: string;
  price: string;
  discountPrice: string;
  description: string;
  features: string;
  tags: string;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  status: string;
  inventory: Record<string, string>;
  images: Array<{ url: string; alt: string; isPrimary: boolean }>;
};

const emptyState = (): ProductFormState => ({
  name: "",
  sku: "",
  brandId: "",
  categoryId: "",
  gender: "UNISEX",
  shoeType: "Sneakers",
  condition: "A",
  originalBrand: "",
  importedFrom: "",
  color: "",
  price: "",
  discountPrice: "",
  description: "",
  features: "",
  tags: "",
  featured: false,
  newArrival: true,
  bestSeller: false,
  status: "DRAFT",
  inventory: Object.fromEntries(SIZES.map((s) => [s, "0"])),
  images: [],
});

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyState());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([
      adminJson<Brand[]>("/api/brands").then(({ json }) => json),
      adminJson<Category[]>("/api/categories").then(({ json }) => json),
    ]).then(([b, c]) => {
      setBrands(b.data || []);
      setCategories(c.data || []);
    });
  }, []);

  useEffect(() => {
    if (!productId) return;
    adminJson(`/api/products/id/${productId}`).then(({ json }) => {
        const p = json.data as Record<string, unknown> | undefined;
        if (!p) return;
        const inventory = Object.fromEntries(SIZES.map((s) => [s, "0"]));
        for (const row of (p.inventory as Array<{ size: string; quantity: number }>) || []) {
          inventory[row.size] = String(row.quantity);
        }
        setForm({
          name: String(p.name || ""),
          sku: String(p.sku || ""),
          brandId: String(p.brandId || ""),
          categoryId: String(p.categoryId || ""),
          gender: String(p.gender || "UNISEX"),
          shoeType: String(p.shoeType || "Sneakers"),
          condition: String(p.condition || "A"),
          originalBrand: String(p.originalBrand || ""),
          importedFrom: String(p.importedFrom || ""),
          color: String(p.color || ""),
          price: String(p.price ?? ""),
          discountPrice: p.discountPrice ? String(p.discountPrice) : "",
          description: String(p.description || ""),
          features: ((p.features as string[]) || []).join("\n"),
          tags: ((p.tags as string[]) || []).join(", "),
          featured: Boolean(p.featured),
          newArrival: Boolean(p.newArrival),
          bestSeller: Boolean(p.bestSeller),
          status: String(p.status || "DRAFT"),
          inventory,
          images: ((p.images as Array<{ url: string; alt: string; isPrimary: boolean }>) || []).map(
            (img) => ({
              url: img.url,
              alt: img.alt,
              isPrimary: img.isPrimary,
            })
          ),
        });
    });
  }, [productId]);

  const setField = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        body.append("folder", "uploads");
        const res = await adminFetch("/api/media", { method: "POST", body });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed");
        setForm((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              url: json.data.url,
              alt: prev.name || file.name,
              isPrimary: prev.images.length === 0,
            },
          ],
        }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const payload = useMemo(
    () => ({
      name: form.name,
      sku: form.sku || undefined,
      brandId: form.brandId,
      categoryId: form.categoryId || null,
      gender: form.gender,
      shoeType: form.shoeType,
      condition: form.condition,
      originalBrand: form.originalBrand || undefined,
      importedFrom: form.importedFrom || undefined,
      color: form.color,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      description: form.description,
      features: form.features
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: form.featured,
      newArrival: form.newArrival,
      bestSeller: form.bestSeller,
      status: form.status,
      inventory: Object.entries(form.inventory)
        .filter(([, qty]) => Number(qty) >= 0)
        .map(([size, quantity]) => ({ size, quantity: Number(quantity) || 0 })),
      images: form.images.map((img, i) => ({
        url: img.url,
        alt: img.alt,
        sortOrder: i,
        isPrimary: img.isPrimary || i === 0,
      })),
    }),
    [form]
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await adminFetch(
        productId ? `/api/products/id/${productId}` : "/api/products",
        {
          method: productId ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <PageHeader
        title={productId ? "Edit product" : "Add product"}
        description="Full inventory details with size-level stock."
        action={
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save product"}
            </Button>
          </div>
        }
      />

      {error && (
        <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
      )}

      <section className="grid gap-6 rounded-2xl border border-border bg-card p-5 lg:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Product name</span>
          <Input value={form.name} onChange={(e) => setField("name", e.target.value)} required />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">SKU</span>
          <Input
            value={form.sku}
            onChange={(e) => setField("sku", e.target.value)}
            placeholder="Auto-generated if empty"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Brand</span>
          <Select
            value={form.brandId}
            onChange={(e) => setField("brandId", e.target.value)}
            required
          >
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Category</span>
          <Select
            value={form.categoryId}
            onChange={(e) => setField("categoryId", e.target.value)}
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Gender</span>
          <Select value={form.gender} onChange={(e) => setField("gender", e.target.value)}>
            <option value="MEN">Men</option>
            <option value="WOMEN">Women</option>
            <option value="UNISEX">Unisex</option>
          </Select>
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Shoe type</span>
          <Select value={form.shoeType} onChange={(e) => setField("shoeType", e.target.value)}>
            {SHOE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Condition</span>
          <Select value={form.condition} onChange={(e) => setField("condition", e.target.value)}>
            <option value="A_PLUS">A+</option>
            <option value="A">A</option>
            <option value="B_PLUS">B+</option>
            <option value="B">B</option>
          </Select>
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Color</span>
          <Input value={form.color} onChange={(e) => setField("color", e.target.value)} />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Original brand</span>
          <Input
            value={form.originalBrand}
            onChange={(e) => setField("originalBrand", e.target.value)}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Imported from</span>
          <Input
            value={form.importedFrom}
            onChange={(e) => setField("importedFrom", e.target.value)}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Price (PKR)</span>
          <Input
            type="number"
            min={1}
            value={form.price}
            onChange={(e) => setField("price", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Discount price</span>
          <Input
            type="number"
            min={1}
            value={form.discountPrice}
            onChange={(e) => setField("discountPrice", e.target.value)}
          />
        </label>
        <label className="text-sm lg:col-span-2">
          <span className="mb-1.5 block font-medium">Description</span>
          <Textarea
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Features (one per line)</span>
          <Textarea
            rows={4}
            value={form.features}
            onChange={(e) => setField("features", e.target.value)}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Tags (comma separated)</span>
          <Textarea rows={4} value={form.tags} onChange={(e) => setField("tags", e.target.value)} />
        </label>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold">Size inventory</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set quantity per EU size. 0 = out of stock on the storefront.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {SIZES.map((size) => (
            <label key={size} className="text-sm">
              <span className="mb-1 block text-xs font-semibold">EU {size}</span>
              <Input
                type="number"
                min={0}
                value={form.inventory[size]}
                onChange={(e) =>
                  setField("inventory", { ...form.inventory, [size]: e.target.value })
                }
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Images</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              JPG / PNG / WEBP. First image is primary unless changed.
            </p>
          </div>
          <label className="cursor-pointer">
            <span className="inline-flex h-11 items-center rounded-xl border border-border px-4 text-sm font-medium text-foreground hover:bg-muted">
              {uploading ? "Uploading…" : "Upload images"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => onUpload(e.target.files)}
            />
          </label>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {form.images.map((img, index) => (
            <div key={`${img.url}-${index}`} className="rounded-xl border border-border p-2">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="200px" />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="text-xs font-medium"
                  onClick={() =>
                    setField(
                      "images",
                      form.images.map((item, i) => ({
                        ...item,
                        isPrimary: i === index,
                      }))
                    )
                  }
                >
                  {img.isPrimary ? "Primary" : "Set primary"}
                </button>
                <button
                  type="button"
                  className="text-xs font-medium text-danger"
                  onClick={() =>
                    setField(
                      "images",
                      form.images.filter((_, i) => i !== index)
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setField("featured", e.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.newArrival}
            onChange={(e) => setField("newArrival", e.target.checked)}
          />
          New arrival
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.bestSeller}
            onChange={(e) => setField("bestSeller", e.target.checked)}
          />
          Best seller
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Status</span>
          <Select value={form.status} onChange={(e) => setField("status", e.target.value)}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </label>
      </section>
    </form>
  );
}

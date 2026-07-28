"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ProductFilters, SortOption } from "@/types";
import { CONDITION_LABELS } from "@/lib/config";
import { filterProducts, getAllSizes, getBrands } from "@/lib/data";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const defaultFilters: ProductFilters = {
  sort: "newest",
  availableOnly: false,
  search: "",
  brand: "",
  size: "",
  condition: "",
  featured: false,
};

function filtersFromSearch(search: string): ProductFilters {
  const params = new URLSearchParams(search);
  return {
    sort: (params.get("sort") || "newest") as SortOption,
    featured: params.get("featured") === "true",
    availableOnly: params.get("available") === "true",
    brand: params.get("brand") || "",
    collection: params.get("collection") || undefined,
    search: params.get("q") || "",
    size: params.get("size") || "",
    condition: (params.get("condition") as ProductFilters["condition"]) || "",
  };
}

export function ShopCatalog() {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setFilters(filtersFromSearch(window.location.search));
  }, []);

  const brands = getBrands();
  const sizes = getAllSizes();
  const products = useMemo(() => filterProducts(filters), [filters]);

  const update = (patch: Partial<ProductFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const clear = () => setFilters({ ...defaultFilters });

  const activeCount = [
    filters.brand,
    filters.size,
    filters.condition,
    filters.availableOnly,
    filters.featured,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search brand, model, color..."
            value={filters.search || ""}
            onChange={(e) => update({ search: e.target.value })}
            className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-sm outline-none transition focus:border-foreground focus-ring"
            aria-label="Search products"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.sort || "newest"}
            onChange={(e) => update({ sort: e.target.value as SortOption })}
            className="h-11 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-foreground focus-ring"
            aria-label="Sort products"
          >
            <option value="newest">Newest</option>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowFilters((v) => !v)}
            className="shrink-0"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters
            {activeCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-8 rounded-2xl border border-border bg-muted/40 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">Filter products</p>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground focus-ring rounded-sm"
            >
              <X className="h-3.5 w-3.5" />
              Clear all
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Brand
              </span>
              <select
                value={filters.brand || ""}
                onChange={(e) => update({ brand: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm focus-ring"
              >
                <option value="">All brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Size
              </span>
              <select
                value={filters.size || ""}
                onChange={(e) => update({ size: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm focus-ring"
              >
                <option value="">All sizes</option>
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    EU {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Condition
              </span>
              <select
                value={filters.condition || ""}
                onChange={(e) =>
                  update({
                    condition: e.target.value as ProductFilters["condition"],
                  })
                }
                className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm focus-ring"
              >
                <option value="">All conditions</option>
                {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col justify-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(filters.availableOnly)}
                  onChange={(e) => update({ availableOnly: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                Available only
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(filters.featured)}
                  onChange={(e) => update({ featured: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                Featured only
              </label>
            </div>
          </div>
        </div>
      )}

      <p className={cn("mb-6 text-sm text-muted-foreground")}>
        Showing{" "}
        <span className="font-semibold text-foreground">{products.length}</span>{" "}
        products
      </p>

      <ProductGrid products={products} priorityCount={4} />
    </div>
  );
}

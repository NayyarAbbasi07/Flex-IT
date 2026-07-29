import { NextRequest } from "next/server";
import { loadFilteredProducts } from "@/lib/storefront";
import { jsonOk } from "@/lib/api";
import type { ProductFilters, SortOption } from "@/types";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const filters: ProductFilters = {
    search: sp.get("q") || undefined,
    brand: sp.get("brand") || undefined,
    collection: sp.get("collection") || undefined,
    size: sp.get("size") || undefined,
    condition: (sp.get("condition") as ProductFilters["condition"]) || undefined,
    featured: sp.get("featured") === "true",
    availableOnly: sp.get("available") === "true",
    sort: (sp.get("sort") as SortOption) || "newest",
  };
  const products = await loadFilteredProducts(filters);
  return jsonOk(products);
}

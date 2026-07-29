import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, parseJson, slugify, generateSku } from "@/lib/api";

const inventorySchema = z.object({
  size: z.string().min(1),
  quantity: z.number().int().min(0),
  lowStockAt: z.number().int().min(0).optional(),
});

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  brandId: z.string().uuid(),
  categoryId: z.string().uuid().optional().nullable(),
  gender: z.enum(["MEN", "WOMEN", "UNISEX"]).optional(),
  shoeType: z.string().optional(),
  condition: z.enum(["A_PLUS", "A", "B_PLUS", "B"]).optional(),
  originalBrand: z.string().optional().nullable(),
  importedFrom: z.string().optional().nullable(),
  color: z.string().optional(),
  price: z.number().int().positive(),
  discountPrice: z.number().int().positive().optional().nullable(),
  featured: z.boolean().optional(),
  newArrival: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  inventory: z.array(inventorySchema).optional(),
  images: z.array(imageSchema).optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const status = searchParams.get("status") || undefined;

  const products = await prisma.product.findMany({
    where: {
      deletedAt: null,
      ...(status ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { sku: { contains: q, mode: "insensitive" } },
              { brand: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      brand: true,
      category: true,
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
      inventory: { orderBy: { size: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return jsonOk(products);
}

export async function POST(request: NextRequest) {
  const parsed = await parseJson(request, productSchema);
  if ("error" in parsed) return parsed.error;

  const data = parsed.data;
  const brand = await prisma.brand.findUnique({ where: { id: data.brandId } });
  if (!brand) return jsonError("Brand not found", 404);

  const slug = data.slug || slugify(data.name);
  const sku = data.sku || generateSku(brand.name, data.name);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      sku,
      description: data.description || "",
      features: data.features || [],
      tags: (data.tags || []).map((t) => t.toLowerCase()),
      brandId: data.brandId,
      categoryId: data.categoryId || null,
      gender: data.gender || "UNISEX",
      shoeType: data.shoeType || "Sneakers",
      condition: data.condition || "A",
      originalBrand: data.originalBrand || brand.name,
      importedFrom: data.importedFrom || null,
      color: data.color || "",
      price: data.price,
      discountPrice: data.discountPrice ?? null,
      featured: data.featured ?? false,
      newArrival: data.newArrival ?? true,
      bestSeller: data.bestSeller ?? false,
      status: data.status || "DRAFT",
      images: data.images?.length
        ? {
            create: data.images.map((img, i) => ({
              url: img.url,
              alt: img.alt || data.name,
              sortOrder: img.sortOrder ?? i,
              isPrimary: img.isPrimary ?? i === 0,
            })),
          }
        : undefined,
      inventory: data.inventory?.length
        ? {
            create: data.inventory.map((row) => ({
              size: row.size,
              quantity: row.quantity,
              lowStockAt: row.lowStockAt ?? 2,
            })),
          }
        : undefined,
    },
    include: {
      brand: true,
      category: true,
      images: true,
      inventory: true,
    },
  });

  return jsonOk(product, { status: 201 });
}

import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, parseJson, slugify } from "@/lib/api";

const inventorySchema = z.object({
  size: z.string().min(1),
  quantity: z.number().int().min(0),
  lowStockAt: z.number().int().min(0).optional(),
});

const imageSchema = z.object({
  id: z.string().uuid().optional(),
  url: z.string().min(1),
  alt: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  brandId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional().nullable(),
  gender: z.enum(["MEN", "WOMEN", "UNISEX"]).optional(),
  shoeType: z.string().optional(),
  condition: z.enum(["A_PLUS", "A", "B_PLUS", "B"]).optional(),
  originalBrand: z.string().optional().nullable(),
  importedFrom: z.string().optional().nullable(),
  color: z.string().optional(),
  price: z.number().int().positive().optional(),
  discountPrice: z.number().int().positive().optional().nullable(),
  featured: z.boolean().optional(),
  newArrival: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  inventory: z.array(inventorySchema).optional(),
  images: z.array(imageSchema).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: {
      brand: true,
      category: true,
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
      inventory: { orderBy: { size: "asc" } },
    },
  });
  if (!product) return jsonError("Product not found", 404);
  return jsonOk(product);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await prisma.product.findFirst({ where: { id, deletedAt: null } });
  if (!existing) return jsonError("Product not found", 404);

  const parsed = await parseJson(request, updateSchema);
  if ("error" in parsed) return parsed.error;
  const data = parsed.data;

  const product = await prisma.$transaction(async (tx) => {
    if (data.inventory) {
      await tx.productInventory.deleteMany({ where: { productId: id } });
      await tx.productInventory.createMany({
        data: data.inventory.map((row) => ({
          productId: id,
          size: row.size,
          quantity: row.quantity,
          lowStockAt: row.lowStockAt ?? 2,
        })),
      });
    }

    if (data.images) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({
        data: data.images.map((img, i) => ({
          productId: id,
          url: img.url,
          alt: img.alt || data.name || existing.name,
          sortOrder: img.sortOrder ?? i,
          isPrimary: img.isPrimary ?? i === 0,
        })),
      });
    }

    return tx.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug || (data.name ? slugify(data.name) : undefined),
        sku: data.sku,
        description: data.description,
        features: data.features,
        tags: data.tags?.map((t) => t.toLowerCase()),
        brandId: data.brandId,
        categoryId: data.categoryId === undefined ? undefined : data.categoryId,
        gender: data.gender,
        shoeType: data.shoeType,
        condition: data.condition,
        originalBrand: data.originalBrand,
        importedFrom: data.importedFrom,
        color: data.color,
        price: data.price,
        discountPrice: data.discountPrice,
        featured: data.featured,
        newArrival: data.newArrival,
        bestSeller: data.bestSeller,
        status: data.status,
      },
      include: {
        brand: true,
        category: true,
        images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
        inventory: { orderBy: { size: "asc" } },
      },
    });
  });

  return jsonOk(product);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await prisma.product.findFirst({ where: { id, deletedAt: null } });
  if (!existing) return jsonError("Product not found", 404);

  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });

  return jsonOk({ id });
}

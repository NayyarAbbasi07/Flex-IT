import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, parseJson, slugify } from "@/lib/api";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const brands = await prisma.brand.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return jsonOk(brands);
}

export async function POST(request: NextRequest) {
  const parsed = await parseJson(request, schema);
  if ("error" in parsed) return parsed.error;
  const data = parsed.data;

  const brand = await prisma.brand.create({
    data: {
      name: data.name,
      slug: data.slug || slugify(data.name),
      description: data.description || null,
      logoUrl: data.logoUrl || null,
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  return jsonOk(brand, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const bodySchema = schema.extend({ id: z.string().uuid() });
  const parsed = await parseJson(request, bodySchema);
  if ("error" in parsed) return parsed.error;
  const { id, ...data } = parsed.data;

  const brand = await prisma.brand.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug || slugify(data.name),
      description: data.description,
      logoUrl: data.logoUrl,
      featured: data.featured,
      sortOrder: data.sortOrder,
    },
  });

  return jsonOk(brand);
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Missing id");
  await prisma.brand.update({ where: { id }, data: { deletedAt: new Date() } });
  return jsonOk({ id });
}

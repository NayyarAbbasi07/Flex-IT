import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, parseJson, slugify } from "@/lib/api";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  enabled: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return jsonOk(categories);
}

export async function POST(request: NextRequest) {
  const parsed = await parseJson(request, schema);
  if ("error" in parsed) return parsed.error;
  const data = parsed.data;

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug || slugify(data.name),
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      enabled: data.enabled ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  return jsonOk(category, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const bodySchema = schema.extend({ id: z.string().uuid() });
  const parsed = await parseJson(request, bodySchema);
  if ("error" in parsed) return parsed.error;
  const { id, ...data } = parsed.data;

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug || slugify(data.name),
      description: data.description,
      imageUrl: data.imageUrl,
      enabled: data.enabled,
      sortOrder: data.sortOrder,
    },
  });

  return jsonOk(category);
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Missing id");
  await prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
  return jsonOk({ id });
}

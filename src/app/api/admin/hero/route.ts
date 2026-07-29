import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonOk, parseJson } from "@/lib/api";

const schema = z.object({
  heading: z.string(),
  subheading: z.string(),
  description: z.string(),
  primaryCtaText: z.string().optional(),
  primaryCtaHref: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
});

export async function GET() {
  let hero = await prisma.heroSection.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!hero) {
    hero = await prisma.heroSection.create({
      data: {
        heading: "Flex it!",
        subheading: "Curated Fashion.",
        description: "Imported Premium Thrift Sneakers Curated For Every Style.",
        imageUrls: [],
      },
    });
  }
  return jsonOk(hero);
}

export async function PUT(request: NextRequest) {
  const parsed = await parseJson(request, schema);
  if ("error" in parsed) return parsed.error;

  const existing = await prisma.heroSection.findFirst({ orderBy: { updatedAt: "desc" } });
  const hero = existing
    ? await prisma.heroSection.update({ where: { id: existing.id }, data: parsed.data })
    : await prisma.heroSection.create({ data: parsed.data });

  return jsonOk(hero);
}

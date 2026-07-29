import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q") || undefined;
  const media = await prisma.mediaAsset.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { filename: { contains: q, mode: "insensitive" } },
              { alt: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return jsonOk(media);
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") || "uploads");

  if (!(file instanceof File)) return jsonError("No file uploaded");
  if (!ALLOWED.has(file.type)) return jsonError("Only JPG, PNG, WEBP allowed");
  if (file.size > MAX_BYTES) return jsonError("File too large (max 5MB)");

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safeName), bytes);

  const url = `/${folder}/${safeName}`;
  const asset = await prisma.mediaAsset.create({
    data: {
      filename: file.name || safeName,
      url,
      mimeType: file.type,
      size: file.size,
      folder,
      alt: String(form.get("alt") || ""),
    },
  });

  return jsonOk(asset, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Missing id");
  await prisma.mediaAsset.update({ where: { id }, data: { deletedAt: new Date() } });
  return jsonOk({ id });
}

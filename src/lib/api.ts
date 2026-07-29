import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

export async function parseJson<T>(
  request: NextRequest,
  schema: z.ZodType<T>
): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return {
        error: jsonError("Validation failed", 422, parsed.error.flatten()),
      };
    }
    return { data: parsed.data };
  } catch {
    return { error: jsonError("Invalid JSON body", 400) };
  }
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateSku(brand: string, name: string) {
  const prefix = brand.slice(0, 3).toUpperCase();
  const code = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${slugify(name).slice(0, 8).toUpperCase()}-${code}`;
}

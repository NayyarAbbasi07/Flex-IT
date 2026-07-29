import { NextRequest } from "next/server";
import { z } from "zod";
import { getStoreSettings, upsertStoreSettings } from "@/lib/settings";
import { jsonOk, parseJson } from "@/lib/api";

const schema = z.record(z.string(), z.string());

export async function GET() {
  return jsonOk(await getStoreSettings());
}

export async function PUT(request: NextRequest) {
  const parsed = await parseJson(request, schema);
  if ("error" in parsed) return parsed.error;
  const settings = await upsertStoreSettings(parsed.data);
  return jsonOk(settings);
}

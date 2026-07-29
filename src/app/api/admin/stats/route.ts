import { getDashboardStats } from "@/lib/catalog";
import { jsonOk } from "@/lib/api";

export async function GET() {
  const stats = await getDashboardStats();
  return jsonOk(stats);
}

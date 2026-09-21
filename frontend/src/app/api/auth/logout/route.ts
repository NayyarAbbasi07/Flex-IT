import { NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const COOKIE = "flexit_token";

export async function POST() {
  await fetch(`${API}/api/auth/logout`, { method: "POST" }).catch(() => null);
  const response = NextResponse.json({ success: true, data: { ok: true } });
  response.cookies.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

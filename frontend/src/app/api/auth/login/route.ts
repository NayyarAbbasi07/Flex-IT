import { NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const COOKIE = "flexit_token";

export async function POST(request: Request) {
  const body = await request.json();
  const upstream = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await upstream.json();
  const response = NextResponse.json(data, { status: upstream.status });

  if (data?.success && data?.data?.token) {
    const remember = Boolean(body?.remember);
    response.cookies.set(COOKIE, data.data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8,
    });
  }

  return response;
}

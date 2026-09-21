import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const COOKIE = "flexit_token";

export async function POST(request: Request) {
  const body = await request.json();
  const token = (await cookies()).get(COOKIE)?.value;

  const upstream = await fetch(`${API}/api/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}`, Cookie: `${COOKIE}=${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await upstream.json().catch(() => ({
    success: false,
    error: "Bad response",
  }));

  return NextResponse.json(data, { status: upstream.status });
}

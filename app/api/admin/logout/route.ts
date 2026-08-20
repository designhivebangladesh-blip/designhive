import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/api/admin-auth";

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ data: { ok: true } });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}

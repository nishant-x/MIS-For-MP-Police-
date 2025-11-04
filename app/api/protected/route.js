import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  const user = await verifyAuth(req, ["admin"]);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    success: true,
    message: `Welcome Admin ${user.id}`,
  });
}

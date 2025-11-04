import { NextResponse } from "next/server";
import { verifyAuth } from "@/middleware/auth";

export async function GET(req) {
  try {
    const user = await verifyAuth(req, ["jawan"]);
    if (!user) {
      return NextResponse.json({ loggedIn: false });
    }

    return NextResponse.json({
      loggedIn: true,
      user,
    });
  } catch (error) {
    console.error("Auth verify failed:", error);
    return NextResponse.json({ loggedIn: false });
  }
}

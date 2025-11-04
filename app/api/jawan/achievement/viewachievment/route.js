import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Achievement from "@/models/achievementmodel";
import { verifyAuth } from "@/middleware/auth";

export async function GET(req) {
  try {
    await connectDB();

    // Get user via JWT from cookies
    const user = await verifyAuth(req, ["jawan"]);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const achievements = await Achievement.find({ officerId: user.id });

    return NextResponse.json({ success: true, achievements }, { status: 200 });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

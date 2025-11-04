import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Achievement from "@/models/achievementmodel";
import { verifyAuth } from "@/middleware/auth";

export async function GET(req) {
  try {
    await connectDB();

    const user = await verifyAuth(req, ["jawan"]); // Role check
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const achievements = await Achievement.find({ officerId: user.id });
    return NextResponse.json(achievements, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}

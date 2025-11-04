import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Leave from "@/models/leavemodel";
import { verifyAuth } from "@/middleware/auth";

export async function POST(req) {
  try {
    await connectDB();

    const user = await verifyAuth(req, ["jawan"]);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reason, fromDate, toDate } = await req.json();
    if (!reason || !fromDate || !toDate) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const leave = new Leave({
      userId: user.id,
      reason,
      fromDate,
      toDate,
    });

    await leave.save();

    // ✅ Convert Mongoose document to plain JSON
    const plainLeave = JSON.parse(JSON.stringify(leave));

    return NextResponse.json(
      { success: true, message: "Leave applied successfully", leave: plainLeave },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error applying leave:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong while applying leave" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const user = await verifyAuth(req, ["jawan"]);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leaves = await Leave.find({ userId: user.id }).sort({ createdAt: -1 });

    // ✅ Convert to plain JSON-safe objects
    const plainLeaves = JSON.parse(JSON.stringify(leaves));

    return NextResponse.json({ success: true, leaves: plainLeaves }, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong while fetching leaves" },
      { status: 500 }
    );
  }
}

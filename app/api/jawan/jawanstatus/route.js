import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import JawanStatus from "@/models/jawanlivestatusmodel";
import mongoose from "mongoose";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function POST(req) {
  try {
    await connectDB();

    const { jawanId } = await req.json();

    if (!jawanId || !jawanId.trim()) {
      return NextResponse.json({ success: false, message: "Jawan ID missing" }, { status: 400 });
    }

    const trimmedId = jawanId.trim();

    if (!isValidObjectId(trimmedId)) {
      return NextResponse.json({ success: false, message: "Invalid Jawan ID" }, { status: 400 });
    }

    const jawanStatus = await JawanStatus.findOne({ jawanId: trimmedId });

    if (!jawanStatus) {
      return NextResponse.json({ success: false, message: "Jawan status not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: jawanStatus });
  } catch (err) {
    console.error("Error fetching jawan status:", err);
    return NextResponse.json({ success: false, message: "Server error", error: err.message }, { status: 500 });
  }
}

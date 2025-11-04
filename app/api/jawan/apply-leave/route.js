import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Leave from "@/models/leavemodel";
import { verifyAuth } from "@/middleware/auth";

export async function POST(req) {
  await connectDB();

  const user = await verifyAuth(req, ["jawan"]); 
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reason, fromDate, toDate } = await req.json();

  if (!reason || !fromDate || !toDate) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const leave = new Leave({ userId: user.id, reason, fromDate, toDate });
  await leave.save();

  return NextResponse.json({ message: "Leave applied successfully", leave }, { status: 201 });
}
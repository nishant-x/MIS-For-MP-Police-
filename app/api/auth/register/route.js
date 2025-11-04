import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/usermodel";
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    const { username, password, role } = await req.json();

    if (!username || !password || !role) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const allowedRoles = ["admin", "jawan", "phq", "station"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
    }

    await connectDB();
    console.log("connected to db");
    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: "User already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

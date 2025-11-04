import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/usermodel";
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    const { id, password } = await req.json(); // match frontend key names

    if (!id || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    await connectDB();

    // Find user by username and role 'jawan'
    const user = await User.findOne({ username: id, role: "jawan" });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = NextResponse.json({
      message: "Login successful",
      user: { id: user._id, username: user.username, role: user.role },
    });

    // Set cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

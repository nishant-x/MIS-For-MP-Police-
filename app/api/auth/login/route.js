import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/usermodel";
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    const { id, password } = await req.json(); 

    if (!id || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by username (id is treated as username) and role 'jawan'
    const user = await User.findOne({ username: id, role: "jawan" });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    // Generate JWT token (1 hour expiry)
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Create response
    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });

    // Set secure HTTP-only cookie
    res.cookies.set("token", token, {
      httpOnly: true, // prevents JS access
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "lax", // allows API + frontend on same domain
      maxAge: 60 * 60, // 1 hour in seconds
      path: "/", // available everywhere
    });

    return res;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

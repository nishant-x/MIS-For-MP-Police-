import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { verifyAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    // Authenticate user before upload
    const user = await verifyAuth(req, ["admin", "officer"]);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const url = await uploadImage(file, "police_achievements");

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

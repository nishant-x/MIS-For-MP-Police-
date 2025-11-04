import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Achievement from "@/models/achievementmodel";
import { verifyAuth } from "@/middleware/auth";
import { uploadImage } from "@/middleware/multer";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectDB();

    // Authenticate user using JWT from cookies
    const user = await verifyAuth(req, ["jawan"]);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const date = formData.get("date");
    const awardedBy = formData.get("awardedBy");
    const location = formData.get("location");
    const remarks = formData.get("remarks");
    const file = formData.get("certificateImage");

    let certificateImage = "";
    if (file && file.size > 0) {
      certificateImage = await uploadImage(file, "certificates");
    }

    const achievement = new Achievement({
      officerId: user.id, // directly from token
      title,
      description,
      date,
      certificateImage,
      awardedBy,
      location,
      remarks,
    });

    await achievement.save();

    return NextResponse.json(
      { success: true, message: "Achievement added successfully", achievement },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding achievement:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong while adding achievement" },
      { status: 500 }
    );
  }
}

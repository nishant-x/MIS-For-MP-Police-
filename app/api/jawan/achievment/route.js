import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Achievement from "@/models/achievementmodel";
import { uploadImage } from "@/middleware/multer"; // Cloudinary upload helper

export const dynamic = "force-dynamic"; // Important for file upload routes

export async function POST(req) {
  try {
    await connectDB();

    // Parse multipart/form-data (for file upload)
    const formData = await req.formData();

    const officerId = formData.get("officerId");
    const title = formData.get("title");
    const description = formData.get("description");
    const date = formData.get("date");
    const awardedBy = formData.get("awardedBy");
    const location = formData.get("location");
    const remarks = formData.get("remarks");
    const file = formData.get("certificateImage");

    // Upload image to Cloudinary
    const certificateImage = await uploadImage(file, "certificates");

    const achievement = new Achievement({
      officerId,
      title,
      description,
      date,
      certificateImage,
      awardedBy,
      location,
      remarks,
    });

    await achievement.save();
    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}

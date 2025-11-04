import { v2 as cloudinary } from "cloudinary";

/**
 * Configure Cloudinary connection.
 */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/**
 * Uploads a file from a Next.js API route to Cloudinary.
 * @param {File} file - File object from formData in Next.js route.
 * @param {string} folder - Target folder name in Cloudinary.
 * @returns {Promise<string>} - The Cloudinary URL of the uploaded file.
 */
export async function uploadImage(file, folder = "police_achievements") {
  if (!file) throw new Error("No file provided");

  // Convert File object (from Next.js formData) to a Node Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Cloudinary using upload_stream
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        allowed_formats: ["jpg", "jpeg", "png", "pdf"],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });

  return result.secure_url; // Return uploaded file URL
}

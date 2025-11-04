import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  officerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the police user
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
  certificateImage: {
    type: String, 
  },
  awardedBy: String,
  location: String,
  remarks: String
});

// Prevent OverwriteModelError in Next.js hot reload
const Achievement = mongoose.models.Achievement || mongoose.model("Achievement", achievementSchema);

export default Achievement;

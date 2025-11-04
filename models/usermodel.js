import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'jawan', 'phq', 'station'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// This prevents OverwriteModelError during hot reload in Next.js
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

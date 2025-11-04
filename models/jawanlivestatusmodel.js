import mongoose from "mongoose";

const jawanStatusSchema = new mongoose.Schema({
  jawanId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true
  },
  status: { 
    type: String, 
    enum: ['active_available', 'active_unavailable', 'unavailable'], 
    default: 'unavailable',
    required: true
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const JawanStatus = mongoose.models.JawanStatus || mongoose.model("JawanStatus", jawanStatusSchema);

export default JawanStatus;

import JawanStatus from "@/models/jawanlivestatusmodel";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { jawanId, status, location } = await req.json();

    if (!jawanId || !status) {
      return NextResponse.json({ success: false, error: "jawanId and status are required" }, { status: 400 });
    }

    if (status === "active_unavailable") {
      if (!location?.lat || !location?.lng || !location?.address) {
        return NextResponse.json(
          { success: false, error: "Location (lat, lng, address) required for 'active_unavailable'" },
          { status: 400 }
        );
      }
    }

    await connectDB();

    const existingStatus = await JawanStatus.findOne({ jawanId });

    if (!existingStatus) {
      const newStatus = new JawanStatus({
        jawanId,
        status,
        ...(status === "active_unavailable" && {
          location: { type: "Point", coordinates: [location.lng, location.lat], address: location.address },
        }),
        timestamp: new Date(),
      });

      const savedStatus = await newStatus.save();
      return NextResponse.json({ success: true, data: savedStatus, message: "New status created" }, { status: 201 });
    }

    const update = {
      status,
      ...(status === "active_unavailable" && {
        location: { type: "Point", coordinates: [location.lng, location.lat], address: location.address },
      }),
      timestamp: new Date(),
    };

    const updatedStatus = await JawanStatus.findOneAndUpdate({ jawanId }, update, { new: true, runValidators: true });

    return NextResponse.json({ success: true, data: updatedStatus, message: "Status updated successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

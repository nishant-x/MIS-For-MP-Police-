"use client";
import { useRouter, useSearchParams } from "next/navigation";

const JawanDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userid = searchParams.get("id");
  const username = searchParams.get("name");

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-start gap-6">
      <h2 className="text-3xl font-bold text-gray-900">Hello {username}</h2>

      <button
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
        onClick={() => router.push(`/jawan/status?name=${username}&id=${userid}`)}
      >
        Update Your Status
      </button>

      <button
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
        onClick={() => router.push(`/jawan/apply-leave?name=${username}&id=${userid}`)}
      >
        Apply for Leave
      </button>

      <button
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
        onClick={() => router.push(`/jawan/achievments?name=${username}&id=${userid}`)}
      >
        View Achievements
      </button>
    </div>
  );
};

export default JawanDashboard;

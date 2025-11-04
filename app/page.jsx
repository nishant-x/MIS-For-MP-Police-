"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleNavigate = (role) => {
    router.push(`/${role}/login`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Police MIS Login Portal
      </h1>

      <div className="flex flex-col gap-4 w-60">
        <button
          onClick={() => handleNavigate("jawan")}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Jawan Login
        </button>

        <button
          onClick={() => handleNavigate("station")}
          className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Station Login
        </button>

        <button
          onClick={() => handleNavigate("phq")}
          className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
        >
          PHQ Login
        </button>
      </div>
    </div>
  );
}

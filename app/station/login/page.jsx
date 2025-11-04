"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StationLogin() {
  const [credentials, setCredentials] = useState({ id: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (credentials.id && credentials.password) {
      alert("Login successful!");
      router.push("/dashboard"); 
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Station Login
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Station ID</label>
          <input
            type="text"
            name="id"
            value={credentials.id}
            onChange={handleChange}
            placeholder="Enter Station ID"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter Password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

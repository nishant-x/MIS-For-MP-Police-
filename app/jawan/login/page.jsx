"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JawanLogin() {
  const [credentials, setCredentials] = useState({ id: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.id || !credentials.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      console.log(data)

      if (res.ok) {
        alert(data.message);
        router.push(`/jawan/dashboard?name=${data?.user?.username}&id=${data?.user?.id}`); 
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Jawan Login
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Jawan ID</label>
          <input
            type="text"
            name="id"
            value={credentials.id}
            onChange={handleChange}
            placeholder="Enter Jawan ID"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-black"
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
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>

        <button
          type="button" // Important! prevent form submission
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition mt-2"
          onClick={() => setCredentials({ id: "nishant", password: "12345678" })}
        >
          Autofill
        </button>

      </form>
    </div>
  );
}

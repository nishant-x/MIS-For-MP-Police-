"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext"; // Import Context

export default function JawanLogin() {
  const [credentials, setCredentials] = useState({ id: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const { loginUser } = useUser(); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.loggedIn && data.user?.role === "jawan") {
          loginUser(data.user); // store user in context
          router.push(
            `/jawan/dashboard?name=${data.user.username}&id=${data.user.id}`
          );
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router, loginUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.id || !credentials.password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (data.success) {
        loginUser(data.user); 
        alert("✅ Login successful!");
        router.push(
          `/jawan/dashboard?name=${encodeURIComponent(
            data.user.username
          )}&id=${data.user.id}`
        );
      } else {
        alert(`❌ ${data.error || "Invalid credentials"}`);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg font-medium">Checking session...</p>
      </div>
    );
  }

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
          disabled={loading}
          className={`w-full py-2 rounded-md text-white transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition mt-2"
          onClick={() => setCredentials({ id: "nishant", password: "12345678" })}
        >
          Autofill Demo
        </button>
      </form>
    </div>
  );
}

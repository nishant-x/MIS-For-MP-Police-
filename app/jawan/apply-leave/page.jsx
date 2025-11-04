"use client";

import React, { useState } from "react";

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    reason: "",
    fromDate: "",
    toDate: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // JWT token

      await fetch("/api/jawan/apply-leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });



      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Leave applied successfully!");
        setFormData({ reason: "", fromDate: "", toDate: "" });
      } else {
        setMessage(data.error || "❌ Something went wrong");
      }
    } catch (err) {
      console.error("Error applying leave:", err);
      setMessage("❌ Network error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Apply for Leave</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={formData.reason}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Apply Leave
        </button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default ApplyLeave;

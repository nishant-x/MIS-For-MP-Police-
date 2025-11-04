"use client";

import React, { useState, useEffect } from "react";

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    reason: "",
    fromDate: "",
    toDate: "",
  });
  const [message, setMessage] = useState("");
  const [leaves, setLeaves] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit leave form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/jawan/apply-leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send cookies automatically
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Leave applied successfully!");
        setFormData({ reason: "", fromDate: "", toDate: "" });
        fetchLeaves(); // refresh list
      } else {
        setMessage(data.error || "❌ Something went wrong");
      }
    } catch (err) {
      console.error("Error applying leave:", err);
      setMessage("❌ Network error");
    }
  };

  // ✅ Fetch user's previous leaves
  const fetchLeaves = async () => {
    try {
      const res = await fetch("/api/jawan/apply-leave", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setLeaves(data.leaves);
      } else {
        setMessage(data.error || "❌ Failed to load previous leaves");
      }
    } catch (err) {
      console.error("Error fetching leaves:", err);
      setMessage("❌ Network error");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Apply for Leave</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={formData.reason}
          onChange={handleChange}
          required
          className="border p-2 rounded text-black"
        />
        <input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          required
          className="border p-2 rounded text-black"
        />
        <input
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleChange}
          required
          className="border p-2 rounded text-black"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Apply Leave
        </button>
      </form>

      {message && <p className="mt-3 text-gray-700">{message}</p>}

      <hr className="my-5" />

      <h3 className="text-xl font-semibold mb-3 text-gray-800">Previous Leaves</h3>
      {leaves.length === 0 ? (
        <p>No leaves applied yet.</p>
      ) : (
        <ul className="space-y-3">
          {leaves.map((leave, i) => (
            <li key={i} className="p-3 border rounded bg-gray-50">
              <p><strong>Reason:</strong> {leave.reason}</p>
              <p>
                <strong>From:</strong> {new Date(leave.fromDate).toLocaleDateString()} —{" "}
                <strong>To:</strong> {new Date(leave.toDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Applied on: {new Date(leave.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApplyLeave;

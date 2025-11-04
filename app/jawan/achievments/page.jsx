"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const AchievementPage = () => {
  const searchParams = useSearchParams();
  const jawanIdParam = searchParams.get("id");

  const [jawanId, setJawanId] = useState(jawanIdParam || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateOfIssue, setDateOfIssue] = useState("");
  const [certificateImage, setCertificateImage] = useState(null);
  const [awardedBy, setAwardedBy] = useState("");
  const [location, setLocation] = useState("");
  const [remarks, setRemarks] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (jawanId) fetchAchievements();
  }, [jawanId]);

  // ✅ Fetch Achievements (no need for token in headers)
  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/jawan/achievement/viewachievment", {
        method: "GET",
        credentials: "include", // Important to send cookies
      });

      const data = await res.json();

      if (data.success) {
        setAchievements(data.achievements);
      } else {
        setStatusMessage("❌ Failed to fetch achievements");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Failed to fetch achievements");
    }
  };

  // ✅ Add Achievement
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", dateOfIssue);
      if (certificateImage) formData.append("certificateImage", certificateImage);
      formData.append("awardedBy", awardedBy);
      formData.append("location", location);
      formData.append("remarks", remarks);

      const res = await fetch("/api/jawan/achievement", {
        method: "POST",
        body: formData,
        credentials: "include", // Send cookies automatically
      });

      const data = await res.json();

      if (data.success) {
        setStatusMessage("✅ Achievement added successfully!");
        setTitle("");
        setDescription("");
        setDateOfIssue("");
        setCertificateImage(null);
        setAwardedBy("");
        setLocation("");
        setRemarks("");
        fetchAchievements();
      } else {
        setStatusMessage(data.error || "❌ Failed to add achievement");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Failed to add achievement");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add Achievement</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {jawanId && (
          <input
            type="text"
            value={jawanId}
            readOnly
            className="bg-gray-200 p-2"
          />
        )}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-2 border"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border"
        />
        <input
          type="date"
          value={dateOfIssue}
          onChange={(e) => setDateOfIssue(e.target.value)}
          required
          className="p-2 border"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCertificateImage(e.target.files[0])}
          className="p-2 border"
        />
        <input
          type="text"
          placeholder="Awarded By"
          value={awardedBy}
          onChange={(e) => setAwardedBy(e.target.value)}
          className="p-2 border"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border"
        />
        <input
          type="text"
          placeholder="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="p-2 border"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 mt-2 hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>

      {statusMessage && <p className="mt-2">{statusMessage}</p>}

      <hr className="my-4" />

      <h3 className="text-xl font-semibold mb-2">Your Achievements</h3>
      {achievements.length === 0 ? (
        <p>No achievements found.</p>
      ) : (
        <ul>
          {achievements.map((ach, index) => (
            <li key={index} className="mb-4 border-b pb-2">
              <strong>{ach.title}</strong> —{" "}
              {new Date(ach.date).toLocaleDateString()}
              {ach.description && <p>{ach.description}</p>}
              {ach.awardedBy && (
                <p>
                  <strong>Awarded By:</strong> {ach.awardedBy}
                </p>
              )}
              {ach.location && (
                <p>
                  <strong>Location:</strong> {ach.location}
                </p>
              )}
              {ach.remarks && (
                <p>
                  <strong>Remarks:</strong> {ach.remarks}
                </p>
              )}
              {ach.certificateImage && (
                <img
                  src={ach.certificateImage}
                  alt="Certificate"
                  className="mt-2 max-w-[200px] rounded shadow"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AchievementPage;

"use client";

import React, { useState, useEffect } from "react";

const StatusTracker = () => {
  const [jawanId, setJawanId] = useState(null);
  const [status, setStatus] = useState("unavailable");
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get jawanId from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) setJawanId(id.trim());
  }, []);

  // Fetch current status from backend
  useEffect(() => {
    if (!jawanId) return;

    const fetchJawanStatus = async () => {
      try {
        const res = await fetch("/api/jawan/jawanstatus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jawanId: jawanId.trim() }),
        });

        const data = await res.json();

        if (data.success) {
          setStatus(data.data.status || "unavailable");
          setLocation(data.data.location || null);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Error fetching status");
        console.error(err);
      }
    };

    fetchJawanStatus();
  }, [jawanId]);

  // Get address from coordinates using geocode API
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(`/api/geocode?lat=${lat}&lon=${lng}`);
      const data = await res.json();
      return data.display_name || "Unknown location";
    } catch {
      return "Unknown location";
    }
  };

  // Get current position using browser geolocation
  const getCurrentPosition = () =>
    new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      } else {
        reject(new Error("Geolocation not supported"));
      }
    });

  // Update status in backend
  const updateBackendStatus = async (status, lat, lng, address) => {
    try {
      const res = await fetch("/api/jawan/jawanstatus/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jawanId: jawanId.trim(),
          status,
          location: lat && lng ? { lat, lng, address } : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");
    } catch {
      setError("Network error. Status not saved.");
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (status === newStatus) return;
    setStatus(newStatus);
    setError("");

    if (newStatus === "active_unavailable") {
      setIsLoading(true);
      try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const address = await getAddressFromCoords(latitude, longitude);

        const newLocation = {
          lat: latitude,
          lng: longitude,
          address,
          timestamp: new Date(),
        };
        setLocation(newLocation);

        await updateBackendStatus(newStatus, latitude, longitude, address);
      } catch {
        setError("Failed to get location. Enable GPS and try again.");
        setStatus("unavailable");
      } finally {
        setIsLoading(false);
      }
    } else {
      setLocation(null);
      await updateBackendStatus(newStatus);
    }
  };

  return (
    <div className="status-tracker p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Police Jawan Status Tracker</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="flex flex-col gap-3">
        <label className={status === "active_available" ? "selected" : ""}>
          <input
            type="radio"
            name="jawanStatus"
            value="active_available"
            checked={status === "active_available"}
            onChange={() => handleStatusChange("active_available")}
            disabled={isLoading}
          />
          Active & Available
        </label>

        <label className={status === "active_unavailable" ? "selected" : ""}>
          <input
            type="radio"
            name="jawanStatus"
            value="active_unavailable"
            checked={status === "active_unavailable"}
            onChange={() => handleStatusChange("active_unavailable")}
            disabled={isLoading}
          />
          {isLoading && status === "active_unavailable"
            ? "🔄 Getting Location..."
            : "Active & Unavailable"}
        </label>

        <label className={status === "unavailable" ? "selected" : ""}>
          <input
            type="radio"
            name="jawanStatus"
            value="unavailable"
            checked={status === "unavailable"}
            onChange={() => handleStatusChange("unavailable")}
            disabled={isLoading}
          />
          Unavailable
        </label>
      </div>

      {status === "active_unavailable" && location && (
        <div className="mt-5 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">📍 Current Location</h3>
          <p>
            <strong>Time:</strong> {new Date(location.timestamp).toLocaleString()}
          </p>
          
          <p>
            <strong>Coordinates:</strong>{" "}
            {location?.lat?.toFixed(4) ?? "N/A"}, {location?.lng?.toFixed(4) ?? "N/A"}
          </p>

          
          <p>
            <strong>Address:</strong> {location.address}
          </p>
          <a
            href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mt-2 inline-block"
          >
            View on OpenStreetMap →
          </a>
        </div>
      )}
    </div>
  );
};

export default StatusTracker;

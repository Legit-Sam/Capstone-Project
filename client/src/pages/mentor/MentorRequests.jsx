// src/pages/MentorRequests.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";
import { getReceivedRequests, updateRequestStatus } from "../../services/mentorServices";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-600",
};

const MentorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await getReceivedRequests();
      setRequests(data);
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
      toast.success(`Request ${status.toLowerCase()}`);
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      toast.error("Failed to update request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
        Mentorship Requests
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">No mentorship requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-blue-800">
                  {req.menteeId?.profile?.name || "Unnamed Mentee"}
                </h3>
                <span
                  className={`mt-2 inline-block text-xs font-medium px-3 py-1 rounded-full ${statusStyles[req.status]}`}
                >
                  {req.status}
                </span>
              </div>

              {req.status === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(req._id, "ACCEPTED")}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-2 rounded-md"
                  >
                    <Check size={16} /> Accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(req._id, "REJECTED")}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-2 rounded-md"
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorRequests;

import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const CompletedSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get("/sessions/completed")
      .then(res => setSessions(res.data))
      .catch(() => toast.error("Failed to load completed sessions"));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">My Completed Sessions</h2>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No completed sessions yet.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => (
            <div key={session._id} className="border rounded p-4 bg-white shadow-sm">
              <p><strong>Mentee:</strong> {session.mentee?.profile?.name}</p>
              <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(session.rating || 0)].map((_, i) => (
                  <Star key={i} size={18} className="text-yellow-500" fill="currentColor" />
                ))}
                {!session.rating && <span className="text-gray-400 text-sm">Not rated yet</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedSessions;

// src/pages/MentorSessions.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MessageSquareText } from "lucide-react";
import { getMySessions, submitFeedback } from "../../services/sessionServices";

const MentorSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data } = await getMySessions();
      const upcoming = data.filter((s) => s.mentorId && s.status === "SCHEDULED");
      setSessions(upcoming);
    } catch (err) {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      setSubmitting(true);
      await submitFeedback(id, { mentorComment: comment });
      toast.success("Session marked as completed");
      setComment("");
      setSelectedSession(null);
      fetchSessions();
    } catch (err) {
      toast.error("Error completing session");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Scheduled Sessions
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : sessions.length === 0 ? (
        <p className="text-center text-gray-500">No scheduled sessions.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="bg-white p-4 rounded-xl shadow border flex flex-col sm:flex-row justify-between sm:items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-700">
                  With: {session.menteeId?.profile?.name || "Mentee"}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(session.date).toLocaleString()}
                </p>
              </div>
              <div className="mt-3 sm:mt-0 flex gap-2">
                <button
                  onClick={() => setSelectedSession(session._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1"
                >
                  <MessageSquareText size={16} /> Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-blue-800">
              Complete Session
            </h3>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-md p-3 text-sm mb-4"
              placeholder="Enter your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedSession(null)}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleComplete(selectedSession)}
                disabled={submitting || !comment.trim()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm disabled:bg-gray-300"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorSessions;

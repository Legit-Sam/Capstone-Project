import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMySessions, submitFeedback } from "../../services/sessionServices";
import { CalendarCheck2 } from "lucide-react";

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data } = await getMySessions();
      setSessions(data);
    } catch (err) {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (sessionId, rating, comment) => {
    try {
      await submitFeedback(sessionId, { rating, comment });
      toast.success("Feedback submitted!");
      fetchSessions();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to submit feedback");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        My Sessions
      </h2>

      {loading ? (
        <p className="text-center">Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p className="text-center">No sessions yet.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => {
            const ended = new Date(s.date) < new Date();
            const feedbackProvided = s.menteeFeedback?.rating;
            const mentorCompleted = s.status === "COMPLETED";

            return (
              <div
                key={s._id}
                className="bg-white p-5 rounded-xl shadow border border-gray-200"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700">
                      {s.mentorId?.profile?.name || "Mentor"}{" "}
                      <span className="text-xs text-gray-500">(Mentor)</span>
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(s.date).toLocaleString()}
                    </p>
                    <p
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                        s.status === "SCHEDULED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {s.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck2 size={20} className="text-green-600" />
                  </div>
                </div>

                {/* Show mentor comment if available */}
                {mentorCompleted && s.mentorComment && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-sm text-blue-900 font-semibold">
                      Mentor's Comment:
                    </p>
                    <p className="text-sm text-blue-800">{s.mentorComment}</p>
                  </div>
                )}

                {/* Show mentee feedback if submitted */}
                {feedbackProvided ? (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p>
                      ⭐ <strong>{s.menteeFeedback.rating}/5</strong>
                    </p>
                    <p className="mt-1 text-gray-700">
                      "{s.menteeFeedback.comment}"
                    </p>
                  </div>
                ) : mentorCompleted ? (
                  // Allow feedback only after mentor marks session completed
                  <FeedbackForm session={s} onSubmit={handleFeedback} />
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const FeedbackForm = ({ session, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Comment is required");
    onSubmit(session._id, rating, comment);
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-2">
      <div>
        <label className="block text-sm font-medium">Your Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 border rounded px-2 py-1"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} Star{n > 1 && "s"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Your Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded px-2 py-1"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default MySessions;

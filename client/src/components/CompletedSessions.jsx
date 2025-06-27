import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

const CompletedSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get("/sessions/completed")
      .then(res => setSessions(res.data))
      .catch(() => toast.error("Failed to load completed sessions"));
  }, []);

  const renderStars = (count = 0) =>
    [...Array(count)].map((_, i) => (
      <Star key={i} size={18} className="text-yellow-500" fill="currentColor" />
    ));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-blue-900 mb-6">My Completed Sessions</h2>

      {sessions.length === 0 ? (
        <p className="text-gray-500 text-center">No completed sessions yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {sessions.map(session => {
            const mentee = session.menteeId?.profile || {};
            const feedback = session.menteeFeedback;

            return (
              <div
                key={session._id}
                className="border rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition"
              >
                <div className="mb-2">
                  <p className="text-sm text-gray-500">Date:</p>
                  <p className="text-lg font-semibold text-blue-800">
                    {new Date(session.date).toLocaleString()}
                  </p>
                </div>

                <div className="mb-2">
                  <p className="text-sm text-gray-500">Mentee:</p>
                  <p className="font-medium text-gray-800">{mentee.name || "Unnamed Mentee"}</p>
                </div>

                <div className="mb-2">
                  <p className="text-sm text-gray-500">Industry:</p>
                  <p className="text-sm text-gray-700">{mentee.industry || "N/A"}</p>
                </div>

                <div className="mb-2">
                  <p className="text-sm text-gray-500">Goals:</p>
                  <p className="text-sm text-gray-700">{mentee.goals || "Not provided"}</p>
                </div>

                <div className="mb-2">
                  <p className="text-sm text-gray-500">Skills:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {mentee.skills?.length ? (
                      mentee.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">No skills listed</span>
                    )}
                  </div>
                </div>

                {feedback ? (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-1">Mentee Feedback:</p>
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(feedback.rating)}
                      <span className="text-sm text-gray-600">({feedback.rating}/5)</span>
                    </div>
                    <p className="text-sm italic text-gray-700">"{feedback.comment}"</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 mt-4">No feedback submitted yet.</p>
                )}

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Your Comment:</p>
                  <p className="text-sm text-gray-700">{session.mentorComment || "No comment"}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompletedSessions;

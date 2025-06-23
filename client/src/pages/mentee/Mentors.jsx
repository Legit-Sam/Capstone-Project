import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserPlus2 } from "lucide-react";
import {
  getMentors,
  sendMentorshipRequest,
  getSentRequests,
} from "../../services/mentorServices";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [requested, setRequested] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const [{ data: mentorList }, { data: sentRequests }] = await Promise.all([
        getMentors(),
        getSentRequests(),
      ]);

      setMentors(mentorList);

      const requestedMap = {};

      // Disable request button for any mentor with a non-completed request
      sentRequests.forEach((req) => {
        if (["PENDING", "ACCEPTED", "SCHEDULED"].includes(req.status)) {
          requestedMap[req.mentorId._id] = true;
        }
      });

      setRequested(requestedMap);
    } catch (err) {
      toast.error("Failed to load mentors or requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (mentorId) => {
    try {
      await sendMentorshipRequest(mentorId);
      toast.success("Request sent!");
      setRequested((prev) => ({ ...prev, [mentorId]: true }));
    } catch (err) {
      const msg = err?.response?.data?.error || "Could not send request";
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center md:text-left mb-8 text-blue-900">
        Browse Mentors
      </h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading mentors...</div>
      ) : mentors.length === 0 ? (
        <div className="text-center text-gray-500">No mentors found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-1">
                {mentor.profile?.name || "Unnamed Mentor"}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                {mentor.profile?.bio || "This mentor has no bio."}
              </p>

              <div className="flex flex-wrap gap-2 text-sm text-gray-700 mt-auto mb-4">
                {mentor.profile?.skills?.length > 0 ? (
                  mentor.profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No skills listed</span>
                )}
              </div>

              <button
                disabled={requested[mentor._id]}
                onClick={() => handleRequest(mentor._id)}
                className={`w-full mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  requested[mentor._id]
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <UserPlus2 size={16} />
                {requested[mentor._id] ? "Already Requested" : "Request Mentorship"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mentors;

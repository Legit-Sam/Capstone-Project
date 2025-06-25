import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserPlus2, Search, Eye } from "lucide-react";
import {
  getMentors,
  sendMentorshipRequest,
  getSentRequests,
} from "../../services/mentorServices";
import { useNavigate } from "react-router-dom";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [requested, setRequested] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const [{ data: mentorList }, { data: sentRequests }] = await Promise.all([
        getMentors(),
        getSentRequests(),
      ]);

      setMentors(mentorList);
      setFilteredMentors(mentorList);

      const requestedMap = {};
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

  useEffect(() => {
    const lower = search.toLowerCase();
    const result = mentors.filter((m) => {
      const name = m.profile?.name?.toLowerCase() || "";
      const bio = m.profile?.bio?.toLowerCase() || "";
      const skills = m.profile?.skills?.join(" ").toLowerCase() || "";
      return name.includes(lower) || bio.includes(lower) || skills.includes(lower);
    });
    setFilteredMentors(result);
  }, [search, mentors]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center sm:text-left text-blue-900">
        Browse Mentors
      </h2>

      {/* Search Input */}
      <div className="mb-8">
        <div className="relative w-full max-w-xl mx-auto sm:mx-0">
          <input
            type="text"
            placeholder="Search by name, skill or bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Mentor Cards */}
      {loading ? (
        <div className="text-center text-gray-500">Loading mentors...</div>
      ) : filteredMentors.length === 0 ? (
        <div className="text-center text-gray-500">No mentors match your search.</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-1">
                {mentor.profile?.name || "Unnamed Mentor"}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {mentor.profile?.bio || "This mentor has no bio."}
              </p>

              <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-4">
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

              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button
                  onClick={() => navigate(`/dashboard/mentor/${mentor._id}`)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-blue-600 text-blue-700 hover:bg-blue-50 transition"
                >
                  <Eye size={16} />
                  View Profile
                </button>

                <button
                  disabled={requested[mentor._id]}
                  onClick={() => handleRequest(mentor._id)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                    requested[mentor._id]
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <UserPlus2 size={16} />
                  {requested[mentor._id] ? "Requested" : "Request"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mentors;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../lib/axios";
import toast from "react-hot-toast";
import { sendMentorshipRequest, getSentRequests } from "../../services/mentorServices";

const MentorProfile = () => {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorRes, requestsRes] = await Promise.all([
          axios.get(`/mentors/${id}`),
          getSentRequests(),
        ]);

        setMentor(mentorRes.data);

        const hasRequested = requestsRes.data.some(
          (req) =>
            req.mentorId._id === id &&
            ["PENDING", "ACCEPTED", "SCHEDULED"].includes(req.status)
        );
        setRequested(hasRequested);
      } catch (err) {
        toast.error("Failed to load mentor profile or requests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRequest = async () => {
    try {
      await sendMentorshipRequest(id);
      toast.success("Request sent!");
      setRequested(true);
    } catch (err) {
      toast.error("Failed to send request");
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;
  if (!mentor) return <p className="p-4 text-red-600">Mentor not found</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white shadow rounded-xl">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-900">
        {mentor.profile?.name}
      </h2>
      <p className="text-gray-700 mb-6">{mentor.profile?.bio}</p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {(mentor.profile?.skills || []).map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
          {mentor.profile?.skills?.length === 0 && (
            <span className="text-sm text-gray-400">No skills listed.</span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Industry</h3>
        <p className="text-gray-700 text-sm">{mentor.profile?.industry || "N/A"}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Availability</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {(mentor.availability || []).map((slot, index) => (
            <div
              key={index}
              className="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded"
            >
              <strong>{slot.dayOfWeek}</strong>: {slot.startTime} - {slot.endTime}
            </div>
          ))}
        </div>
        {(!mentor.availability || mentor.availability.length === 0) && (
          <p className="text-sm text-gray-400">No availability listed.</p>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={handleRequest}
          disabled={requested}
          className={`w-full sm:w-auto px-6 py-2 rounded text-sm font-medium transition ${
            requested
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {requested ? "Request Sent" : "Request Mentorship"}
        </button>
      </div>
    </div>
  );
};

export default MentorProfile;

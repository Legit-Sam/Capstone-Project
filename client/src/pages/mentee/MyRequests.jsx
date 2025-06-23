import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getSentRequests,
  getAvailabilityByMentor,
} from "../../services/mentorServices";
import { scheduleSession } from "../../services/sessionServices";
import { CalendarCheck2, CheckCircle2, X } from "lucide-react";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-600",
  SCHEDULED: "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-200 text-gray-800",
};

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await getSentRequests();
      setRequests(data);
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (mentorId) => {
    setSelectedMentor(mentorId);
    setShowModal(true);
    try {
      const { data } = await getAvailabilityByMentor(mentorId);
      setAvailability(data.availability);
    } catch (err) {
      toast.error("Could not load availability");
    }
  };

  const closeModal = () => {
    setSelectedMentor(null);
    setAvailability([]);
    setSelectedSlots([]);
    setShowModal(false);
  };

  const handleSlotClick = (slot) => {
    const exists = selectedSlots.find(
      (s) =>
        s.dayOfWeek === slot.dayOfWeek &&
        s.startTime === slot.startTime &&
        s.endTime === slot.endTime
    );

    if (exists) {
      setSelectedSlots((prev) =>
        prev.filter(
          (s) =>
            !(
              s.dayOfWeek === slot.dayOfWeek &&
              s.startTime === slot.startTime &&
              s.endTime === slot.endTime
            )
        )
      );
    } else {
      setSelectedSlots((prev) => [...prev, slot]);
    }
  };

  const handleSubmit = async () => {
    if (selectedSlots.length === 0) {
      return toast.error("Please select at least one slot");
    }

    try {
      await scheduleSession({
        mentorId: selectedMentor,
        sessions: selectedSlots.map((slot) => ({
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      });

      toast.success("Sessions scheduled successfully!");

      // Optimistically update UI
      setRequests((prev) =>
        prev.map((req) =>
          req.mentorId._id === selectedMentor ? { ...req, status: "SCHEDULED" } : req
        )
      );

      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to schedule sessions");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        My Mentorship Requests
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">No mentorship requests found.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const status = req.status;
            const mentorName = req.mentorId?.profile?.name || "Mentor";

            return (
              <div
                key={req._id}
                className="bg-white rounded-xl p-5 shadow hover:shadow-md border border-gray-100 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-blue-700">{mentorName}</h3>
                    <span
                      className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-semibold ${statusStyles[status]}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Show correct action based on status */}
                  {status === "SCHEDULED" && (
                    <div className="flex items-center text-green-600 gap-1 text-sm font-medium">
                      <CalendarCheck2 size={18} />
                      Session Scheduled
                    </div>
                  )}

                  {status === "COMPLETED" && (
                    <div className="flex items-center text-gray-700 gap-1 text-sm font-medium">
                      <CheckCircle2 size={18} />
                      Session Completed
                    </div>
                  )}

                  {status === "ACCEPTED" && (
                    <button
                      onClick={() => openModal(req.mentorId._id)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-md text-sm hover:from-blue-700 hover:to-blue-800"
                    >
                      Book Session
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for scheduling */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-md shadow-xl border border-gray-200 rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-blue-700">Schedule Session</h3>

            <div className="space-y-3">
              {availability.length === 0 ? (
                <p className="text-sm text-gray-500">No availability set by mentor.</p>
              ) : (
                <div className="space-y-2">
                  {availability.map((slot, idx) => {
                    const selected = selectedSlots.some(
                      (s) =>
                        s.dayOfWeek === slot.dayOfWeek &&
                        s.startTime === slot.startTime &&
                        s.endTime === slot.endTime
                    );
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSlotClick(slot)}
                        className={`cursor-pointer p-3 rounded border flex justify-between items-center ${
                          selected
                            ? "bg-blue-100 border-blue-400"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-blue-800">{slot.dayOfWeek}</p>
                          <p className="text-sm text-gray-700">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                        {selected && <X size={16} className="text-red-500" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm rounded-md text-gray-600 hover:text-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedSlots.length === 0}
                className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;

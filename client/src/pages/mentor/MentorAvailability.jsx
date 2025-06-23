import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";
import {
  getMyAvailability,
  upsertAvailability,
  deleteAvailability,
} from "../../services/mentorServices";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MentorAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [newSlot, setNewSlot] = useState({ dayOfWeek: "", startTime: "", endTime: "" });
  const [loading, setLoading] = useState(false);

  const fetchAvailability = async () => {
    try {
      const { data } = await getMyAvailability();
      setAvailability(data.availability || []);
    } catch (err) {
      toast.error("Could not fetch availability");
    }
  };

  const handleAddSlot = () => {
    const { dayOfWeek, startTime, endTime } = newSlot;
    if (!dayOfWeek || !startTime || !endTime) {
      return toast.error("All fields are required");
    }
    setAvailability((prev) => [...prev, newSlot]);
    setNewSlot({ dayOfWeek: "", startTime: "", endTime: "" });
  };

  const handleDeleteSlot = (index) => {
    setAvailability((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (availability.length < 3) {
      return toast.error("At least 3 availability slots are required.");
    }

    try {
      setLoading(true);
      await upsertAvailability({ availability });
      toast.success("Availability saved successfully!");
    } catch (err) {
      toast.error("Failed to save availability.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await deleteAvailability();
      setAvailability([]);
      toast.success("Availability cleared.");
    } catch (err) {
      toast.error("Failed to delete availability");
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">Set Your Availability</h2>

      <div className="mb-6 space-y-4">
        {availability.length === 0 ? (
          <p className="text-gray-500 text-center">No availability slots yet.</p>
        ) : (
          availability.map((slot, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-white p-3 border rounded shadow-sm"
            >
              <div className="text-gray-800 font-medium">
                {slot.dayOfWeek}: {slot.startTime} - {slot.endTime}
              </div>
              <button
                onClick={() => handleDeleteSlot(idx)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add new slot */}
      <div className="bg-gray-50 p-4 rounded border mb-6 shadow-sm">
        <h4 className="font-semibold mb-2 text-blue-800">Add New Slot</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={newSlot.dayOfWeek}
            onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">Select Day</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={newSlot.startTime}
            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="time"
            value={newSlot.endTime}
            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={handleAddSlot}
          className="mt-3 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          <Plus size={16} /> Add Slot
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end">
        <button
          onClick={handleClear}
          className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 text-sm rounded"
        >
          Clear All
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded disabled:bg-gray-300"
        >
          {loading ? "Saving..." : "Save Availability"}
        </button>
      </div>
    </div>
  );
};

export default MentorAvailability;

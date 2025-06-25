import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import toast from "react-hot-toast";

const roleOptions = [
  { value: "MENTEE", label: "Mentee" },
  { value: "MENTOR", label: "Mentor" },
  { value: "ADMIN", label: "Admin" },
];

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mentorAvailability, setMentorAvailability] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/admin/users");
      setUsers(data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success("Role updated");
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to update role");
    }
  };

  const viewAvailability = async (mentorId) => {
    try {
      const { data } = await axios.get(`/admin/mentor/${mentorId}/availability`);
      setMentorAvailability(data);
    } catch {
      toast.error("Could not fetch availability");
    }
  };

  const closeAvailability = () => setMentorAvailability(null);

  return (
    <div className="p-4 sm:p-8 w-full max-w-[100vw] overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Users</h1>
        <span className="text-sm text-gray-500 mt-2 sm:mt-0">
          {users.length} users
        </span>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="py-12 text-center text-blue-500 font-medium animate-pulse">
            Loading users...
          </div>
        ) : (
          <table className="min-w-full text-sm sm:text-base">
            <thead className="bg-blue-50 text-blue-700 uppercase text-xs sm:text-sm">
              <tr>
                <th className="p-4 text-left whitespace-nowrap">Email</th>
                <th className="p-4 text-left whitespace-nowrap">Role</th>
                <th className="p-4 text-left whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-blue-50 transition">
                  <td className="p-4 break-all max-w-xs">{u.email}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="border rounded-lg px-3 py-1 bg-white w-full sm:w-auto focus:ring-2 focus:ring-blue-200 transition"
                    >
                      {roleOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    {u.role === "MENTOR" && (
                      <button
                        onClick={() => viewAvailability(u._id)}
                        className="inline-block px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
                      >
                        View Availability
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mentor Availability Modal/Panel */}
      {mentorAvailability && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative animate-fadeIn">
            <button
              onClick={closeAvailability}
              className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Availability for {mentorAvailability.mentor}
            </h3>
            {mentorAvailability.availability.length > 0 ? (
              mentorAvailability.availability.map((block, idx) => (
                <div key={idx} className="mb-4 border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-700 mb-1">
                    Slot Block {idx + 1}
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base">
                    {block.availability.map((slot, i) => (
                      <li key={i} className="whitespace-nowrap">
                        <strong>{slot.dayOfWeek}</strong>: {slot.startTime} - {slot.endTime}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No availability set.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
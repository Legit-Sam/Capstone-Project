import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import toast from "react-hot-toast";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mentorAvailability, setMentorAvailability] = useState(null);

  useEffect(() => {
    fetchUsers();
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

  return (
    <div className="p-4 sm:p-6 w-full max-w-[100vw] overflow-hidden">
      <h1 className="text-xl sm:text-3xl font-bold mb-6 text-gray-800">Manage Users</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="min-w-full text-sm sm:text-base bg-white border rounded-lg">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs sm:text-sm">
              <tr>
                <th className="p-4 text-left whitespace-nowrap">Email</th>
                <th className="p-4 text-left whitespace-nowrap">Role</th>
                <th className="p-4 text-left whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 break-all max-w-xs">{u.email}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="border rounded px-3 py-1 bg-white w-full sm:w-auto"
                    >
                      <option value="MENTEE">MENTEE</option>
                      <option value="MENTOR">MENTOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {u.role === "MENTOR" && (
                      <button
                        onClick={() => viewAvailability(u._id)}
                        className="text-blue-600 underline text-sm hover:text-blue-800"
                      >
                        View Availability
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mentorAvailability && (
        <div className="mt-8 bg-white rounded-lg shadow p-4 sm:p-6 w-full max-w-full overflow-x-auto">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Availability for {mentorAvailability.mentor}
          </h3>

          {mentorAvailability.availability.length > 0 ? (
            mentorAvailability.availability.map((block, idx) => (
              <div key={idx} className="mb-4 border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-700 mb-1">Slot Block {idx + 1}</h4>
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
      )}
    </div>
  );
};

export default ManageUsersPage;

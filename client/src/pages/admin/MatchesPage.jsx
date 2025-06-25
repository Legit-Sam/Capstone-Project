import React, { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import toast from 'react-hot-toast';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [mentorId, setMentorId] = useState('');
  const [menteeId, setMenteeId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMatches();
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchMatches = async () => {
    try {
      const { data } = await axios.get('/admin/matches');
      setMatches(data);
    } catch {
      toast.error('Failed to fetch matches');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/admin/users');
      setUsers(data);
    } catch {
      toast.error('Failed to fetch users');
    }
  };

  const assignMatch = async () => {
    if (!mentorId || !menteeId) return toast.error('Select both mentor and mentee');
    try {
      setLoading(true);
      await axios.post('/admin/assign-mentor', { mentorId, menteeId });
      toast.success('Match created (awaiting mentee schedule)');
      setMentorId('');
      setMenteeId('');
      fetchMatches();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Assignment failed');
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Awaiting Mentee Schedule';
      case 'SCHEDULED': return 'Session Scheduled';
      case 'COMPLETED': return 'Session Completed';
      case 'ACCEPTED': return 'Mentor Accepted (Awaiting Schedule)';
      case 'REJECTED': return 'Mentor Rejected';
      default: return status;
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'ACCEPTED': return 'bg-orange-100 text-orange-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">Mentorship Matches</h1>

      {/* Assign Match Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-white p-6 rounded-2xl shadow flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Manually Assign Mentor</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={mentorId}
            onChange={(e) => setMentorId(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-1/2 focus:ring-2 focus:ring-blue-200 transition"
          >
            <option value="">Select Mentor</option>
            {users.filter((u) => u.role === 'MENTOR').map((u) => (
              <option key={u._id} value={u._id}>{u.email}</option>
            ))}
          </select>

          <select
            value={menteeId}
            onChange={(e) => setMenteeId(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-1/2 focus:ring-2 focus:ring-blue-200 transition"
          >
            <option value="">Select Mentee</option>
            {users.filter((u) => u.role === 'MENTEE').map((u) => (
              <option key={u._id} value={u._id}>{u.email}</option>
            ))}
          </select>
        </div>
        <button
          onClick={assignMatch}
          className="self-start mt-2 px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Assigning...' : 'Assign Mentor'}
        </button>
      </div>

      {/* Matches List */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-blue-700">All Matches</h2>
        {matches.length === 0 ? (
          <p className="text-gray-500">No matches found.</p>
        ) : (
          <ul className="divide-y">
            {matches.map((m) => (
              <li key={m._id} className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-700">
                      <span className="text-blue-600">Mentor:</span> {m.mentorId?.email}
                    </p>
                    <p className="font-medium text-gray-700">
                      <span className="text-green-600">Mentee:</span> {m.menteeId?.email}
                    </p>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full font-medium text-xs sm:text-sm ${statusColor(m.status)}`}>
                    {statusLabel(m.status)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;
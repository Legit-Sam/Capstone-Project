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
  }, []);

  const fetchMatches = async () => {
    try {
      const { data } = await axios.get('/admin/matches');
      // filter only manually assigned matches (if needed by logic)
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
      case 'PENDING': return 'text-yellow-600';
      case 'SCHEDULED': return 'text-blue-600';
      case 'COMPLETED': return 'text-green-600';
      case 'ACCEPTED': return 'text-orange-600';
      case 'REJECTED': return 'text-red-500';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Mentorship Matches</h1>

      {/* Assign Match Section */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Manually Assign Mentor</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={mentorId}
            onChange={(e) => setMentorId(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-1/2"
          >
            <option value="">Select Mentor</option>
            {users.filter((u) => u.role === 'MENTOR').map((u) => (
              <option key={u._id} value={u._id}>{u.email}</option>
            ))}
          </select>

          <select
            value={menteeId}
            onChange={(e) => setMenteeId(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-1/2"
          >
            <option value="">Select Mentee</option>
            {users.filter((u) => u.role === 'MENTEE').map((u) => (
              <option key={u._id} value={u._id}>{u.email}</option>
            ))}
          </select>
        </div>
        <button
          onClick={assignMatch}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Assigning...' : 'Assign Mentor'}
        </button>
      </div>

      {/* Matches List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">All Matches</h2>
        {matches.length === 0 ? (
          <p className="text-gray-500">No matches found.</p>
        ) : (
          <ul className="divide-y">
            {matches.map((m) => (
              <li key={m._id} className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p><strong>Mentor:</strong> {m.mentorId?.email}</p>
                    <p><strong>Mentee:</strong> {m.menteeId?.email}</p>
                  </div>
                  <div className={`font-medium ${statusColor(m.status)} mt-2 sm:mt-0`}>
                    {statusLabel(m.status)}
                  </div>
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

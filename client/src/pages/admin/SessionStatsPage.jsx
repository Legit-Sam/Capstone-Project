import React, { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import { format } from 'date-fns';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0ea5e9', '#94a3b8']; // Tailwind blue-500, slate-400

const SessionStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/admin/sessions/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  const getAverageRatingData = () => {
    if (!stats?.feedback) return [];
    return stats.feedback
      .filter(f => f.menteeRating !== null)
      .map(f => ({
        mentee: f.mentee,
        rating: f.menteeRating
      }));
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!stats) return <div className="p-6 text-red-500">Failed to load session stats</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Session Statistics</h1>

      {/* Chart: Completion */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Session Completion Overview</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: 'Completed', value: stats.completed },
                { name: 'Pending', value: stats.totalSessions - stats.completed },
              ]}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {COLORS.map((color, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Chart: Ratings */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Mentee Ratings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getAverageRatingData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mentee" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="rating" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feedback List */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">Feedback Summary</h2>
        {stats.feedback.length === 0 ? (
          <p className="text-gray-500">No feedback submitted yet.</p>
        ) : (
          <ul className="space-y-5">
            {stats.feedback.map((s) => (
              <li key={s.sessionId} className="border border-gray-200 p-5 rounded-lg hover:shadow-sm transition">
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Date:</strong> {format(new Date(s.date), 'PPPpp')}
                </p>
                <p className="text-sm"><strong>Mentor:</strong> {s.mentor}</p>
                <p className="text-sm"><strong>Mentee:</strong> {s.mentee}</p>
                {s.mentorComment && (
                  <p className="text-sm text-blue-700 mt-1"><strong>Mentor's Comment:</strong> {s.mentorComment}</p>
                )}
                {s.menteeRating !== null && (
                  <p className="text-sm text-yellow-700 mt-1"><strong>Mentee Rating:</strong> {s.menteeRating}/5</p>
                )}
                {s.menteeComment && (
                  <p className="text-sm text-gray-700 mt-1"><strong>Mentee Feedback:</strong> {s.menteeComment}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SessionStatsPage;

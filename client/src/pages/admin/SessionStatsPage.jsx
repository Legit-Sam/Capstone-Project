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
    // eslint-disable-next-line
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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-blue-500 font-medium">Loading session stats...</span>
    </div>
  );
  if (!stats) return <div className="p-6 text-red-500">Failed to load session stats</div>;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-blue-700 tracking-tight">Session Statistics</h1>

      {/* Chart: Completion */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Session Completion Overview</h2>
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
              outerRadius={90}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {COLORS.map((color, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-8 mt-4">
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[0] }}></span>
            Completed
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[1] }}></span>
            Pending
          </span>
        </div>
      </div>

      {/* Chart: Ratings */}
      <div className="bg-gradient-to-r from-white to-blue-50 p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Mentee Ratings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getAverageRatingData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mentee" />
            <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
            <Tooltip />
            <Bar dataKey="rating" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feedback List */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-6 text-blue-700">Feedback Summary</h2>
        {stats.feedback.length === 0 ? (
          <p className="text-gray-500">No feedback submitted yet.</p>
        ) : (
          <ul className="space-y-5">
            {stats.feedback.map((s) => (
              <li
                key={s.sessionId}
                className="border border-blue-100 p-5 rounded-xl hover:shadow-lg transition bg-gradient-to-br from-blue-50/50 to-white"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Date:</strong> {format(new Date(s.date), 'PPPpp')}
                  </p>
                  {s.menteeRating !== null && (
                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                      ⭐ {s.menteeRating}/5
                    </span>
                  )}
                </div>
                <p className="text-sm"><strong>Mentor:</strong> {s.mentor}</p>
                <p className="text-sm"><strong>Mentee:</strong> {s.mentee}</p>
                {s.mentorComment && (
                  <p className="text-sm text-blue-700 mt-1"><strong>Mentor's Comment:</strong> {s.mentorComment}</p>
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
// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Calendar,
  UserCheck,
  Users,
  BarChart,
  ClipboardList,
  Settings,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const Card = ({ icon: Icon, title, description, link }) => (
    <Link
      to={link}
      className="flex items-center gap-4 bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
    >
      <Icon size={28} className="text-blue-600" />
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Welcome back, {user?.profile?.name || "User"} 👋
      </h2>
      <p className="text-gray-600">Role: {user?.role}</p>

      {/* Role-based content */}
      {user?.role === "MENTEE" && (
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card
            icon={Users}
            title="Find Mentors"
            description="Browse and connect with available mentors."
            link="/dashboard/mentors"
          />
          <Card
            icon={UserCheck}
            title="My Requests"
            description="Track the mentorship requests you've sent."
            link="/dashboard/my-requests"
          />
          <Card
            icon={Calendar}
            title="My Sessions"
            description="View and manage upcoming mentorship sessions."
            link="/dashboard/my-sessions"
          />
        </div>
      )}

      {user?.role === "MENTOR" && (
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card
            icon={UserCheck}
            title="Mentorship Requests"
            description="View and accept incoming mentee requests."
            link="/dashboard/requests"
          />
          <Card
            icon={Calendar}
            title="Availability"
            description="Update your available time slots for sessions."
            link="/dashboard/availability"
          />
          <Card
            icon={ClipboardList}
            title="Sessions"
            description="See all your upcoming mentoring sessions."
            link="/dashboard/sessions"
          />
        </div>
      )}

      {user?.role === "ADMIN" && (
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card
            icon={Users}
            title="Manage Users"
            description="View and manage all platform users."
            link="/dashboard/admin/users"
          />
          <Card
            icon={BarChart}
            title="Mentorship Matches"
            description="View and assign mentor-mentee pairings."
            link="/dashboard/admin/matches"
          />
          <Card
            icon={Settings}
            title="Session Stats"
            description="See session feedback and completion rate."
            link="/dashboard/admin/sessions"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

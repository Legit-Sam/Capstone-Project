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

const cardData = {
  MENTEE: [
    {
      icon: Users,
      title: "Find Mentors",
      description: "Browse and connect with available mentors.",
      link: "/dashboard/mentors",
    },
    {
      icon: UserCheck,
      title: "My Requests",
      description: "Track the mentorship requests you've sent.",
      link: "/dashboard/my-requests",
    },
    {
      icon: Calendar,
      title: "My Sessions",
      description: "View and manage upcoming mentorship sessions.",
      link: "/dashboard/my-sessions",
    },
  ],
  MENTOR: [
    {
      icon: UserCheck,
      title: "Mentorship Requests",
      description: "View and accept incoming mentee requests.",
      link: "/dashboard/requests",
    },
    {
      icon: Calendar,
      title: "Availability",
      description: "Update your available time slots for sessions.",
      link: "/dashboard/availability",
    },
    {
      icon: ClipboardList,
      title: "Sessions",
      description: "See all your upcoming mentoring sessions.",
      link: "/dashboard/sessions",
    },
  ],
  ADMIN: [
    {
      icon: Users,
      title: "Manage Users",
      description: "View and manage all platform users.",
      link: "/dashboard/admin/users",
    },
    {
      icon: BarChart,
      title: "Mentorship Matches",
      description: "View and assign mentor-mentee pairings.",
      link: "/dashboard/admin/matches",
    },
    {
      icon: Settings,
      title: "Session Stats",
      description: "See session feedback and completion rate.",
      link: "/dashboard/admin/sessions",
    },
  ],
};

const Card = ({ icon: Icon, title, description, link }) => (
  <Link
    to={link}
    className="flex items-center gap-4 bg-white rounded-2xl shadow p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-transparent hover:border-blue-200 group"
  >
    <span className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 group-hover:bg-blue-100 transition">
      <Icon size={30} className="text-blue-600 group-hover:text-blue-700" />
    </span>
    <div>
      <h3 className="text-lg font-semibold group-hover:text-blue-700">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Welcome back, {user?.profile?.name || "User"} 👋
          </h2>
          <p className="text-gray-600">Role: {user?.role}</p>
        </div>
      </div>
      {user?.role && cardData[user.role] && (
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          {cardData[user.role].map((card) => (
            <Card key={card.title} {...card} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
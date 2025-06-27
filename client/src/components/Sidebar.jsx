import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home, Users, Calendar, UserCheck, List, Settings, User, Star
} from "lucide-react";

const Sidebar = ({ onNavigate }) => {
  const { user } = useAuth();

  const linkClass =
    "flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 transition text-sm font-medium";
  const activeClass = "bg-blue-100 text-blue-800";

  return (
    <div className="w-64 bg-white h-screen shadow-md p-4 flex flex-col justify-between">
      {/* Top navigation */}
      <div>
        <h2 className="text-lg font-semibold mb-6">Menu</h2>
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/dashboard"
            onClick={onNavigate}
            className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
          >
            <Home size={18} />
            Dashboard
          </NavLink>

          {user?.role === "MENTEE" && (
            <>
              <NavLink to="/dashboard/mentors" onClick={onNavigate} className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
                <Users size={18} /> Find Mentors
              </NavLink>
              <NavLink to="/dashboard/my-requests" onClick={onNavigate} className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
                <UserCheck size={18} /> My Requests
              </NavLink>
              <NavLink to="/dashboard/my-sessions" onClick={onNavigate} className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
                <Calendar size={18} /> My Sessions
              </NavLink>
            </>
          )}

          {user?.role === "MENTOR" && (
            <>
              <NavLink to="/dashboard/requests" onClick={onNavigate} className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
                <List size={18} /> Requests
              </NavLink>
              <NavLink to="/dashboard/availability" onClick={onNavigate} className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
                <Calendar size={18} /> Availability
              </NavLink>
              <NavLink to="/dashboard/sessions" onClick={onNavigate} className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
                <Calendar size={18} /> Sessions
              </NavLink>
               <NavLink to="/dashboard/completed-sessions" onClick={onNavigate} className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
                <Star size={18} /> My Completed Sessions
              </NavLink>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <NavLink to="/dashboard/admin/users" onClick={onNavigate} className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
                <Users size={18} /> Manage Users
              </NavLink>
              <NavLink to="/dashboard/admin/matches" onClick={onNavigate} className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
                <UserCheck size={18} /> View Matches
              </NavLink>
              <NavLink to="/dashboard/admin/sessions" onClick={onNavigate} className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
                <Settings size={18} /> Session Stats
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Bottom profile link */}
      <div>
        <NavLink
          to="/profile/edit"
          onClick={onNavigate}
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
        >
          <User size={18} />
          Profile
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

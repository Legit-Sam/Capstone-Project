import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Public Pages
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";


// Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Common Dashboard Pages
import Dashboard from "./pages/Dashboard";

// User Profile
import EditProfile from "./pages/EditProfile";


// Mentee Pages
import Mentors from "./pages/mentee/Mentors";
import MyRequests from "./pages/mentee/MyRequests";
import MySessions from "./pages/mentee/MySessions";

// Mentor Pages
import MentorRequests from "./pages/mentor/MentorRequests";
import MentorAvailability from "./pages/mentor/MentorAvailability";
import MentorSessions from "./pages/mentor/MentorSessions";

//Admin Pages
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import MatchesPage from "./pages/admin/MatchesPage";
import SessionStatsPage from "./pages/admin/SessionStatsPage";

function App() {
  const { user } = useAuth();

  const isMentee = user?.role === "MENTEE";
  const isMentor = user?.role === "MENTOR";
  const isAdmin = user?.role === "ADMIN";

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/profile/edit"
        element={user ? <EditProfile /> : <Navigate to="/login" />}
      />

      {/* Protected Dashboard Routes */}
      {user && (
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          {/* Mentee-specific Routes */}
          {isMentee && (
            <>
              <Route path="mentors" element={<Mentors />} />
              <Route path="my-requests" element={<MyRequests />} />
              <Route path="my-sessions" element={<MySessions />} />
            </>
          )}

          {/* Mentor-specific Routes */}
          {isMentor && (
            <>
              <Route path="requests" element={<MentorRequests />} />
              <Route path="availability" element={<MentorAvailability />} />
              <Route path="sessions" element={<MentorSessions />} />
            </>
          )}

         {/* Admin-specific Routes */}
{isAdmin && (
  <>
    <Route path="admin/users" element={<ManageUsersPage />} />
    <Route path="admin/matches" element={<MatchesPage />} />
    <Route path="admin/sessions" element={<SessionStatsPage />} />
  </>
)}
        </Route>
      )}

      {/* Optional fallback route */}
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
}

export default App;

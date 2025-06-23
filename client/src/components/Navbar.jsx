// src/components/Navbar.jsx
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow px-4 md:px-6 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
      <h1 className="text-lg md:text-xl font-bold">Mentorship Platform</h1>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto">
        <p className="text-gray-600 text-sm md:text-base">
          {user?.profile?.name || "User"}
        </p>
        <button
          onClick={logout}
          className="bg-red-500 text-white text-sm md:text-base px-4 py-1.5 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;

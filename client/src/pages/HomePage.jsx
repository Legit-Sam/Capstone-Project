// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Mentorship Match</h1>
        <p className="text-gray-600 mb-6">
          Connect with mentors, schedule sessions, and grow together.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 bg-white border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
};

export default HomePage;

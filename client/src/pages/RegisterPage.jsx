import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../lib/axios';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await axios.post('/auth/register', form);
      toast.success(res.data.message || "Registered successfully!");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Register Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <span className="inline-block w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#0ea5e9" />
              </svg>
            </span>
            <span className="font-extrabold text-2xl text-gray-800">Connecto</span>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Create Account</h2>
          <p className="text-gray-500 mb-6 text-center">Please enter your details</p>

          <div className="relative mb-4">
            <Mail className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative mb-4">
            <Lock className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-3 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 font-semibold"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className="text-sm text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Right: Illustration */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-[#007aff] relative">
         <img
          src="./team-illustration.svg"
          alt="Login Illustration"
          className="w-3/4 max-w-lg"
        />
        <Link
          to="/"
          className="absolute bottom-6 left-6 text-white text-sm hover:underline flex items-center gap-1"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
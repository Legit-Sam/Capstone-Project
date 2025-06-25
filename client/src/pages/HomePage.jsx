import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // if (user) {
    //   navigate('/dashboard');
    // }
    // eslint-disable-next-line
  }, [user]);

  return (
    <main className="min-h-screen bg-white flex flex-col relative overflow-x-hidden">
      {/* Top Nav */}
      <nav className="w-full flex justify-between items-center py-6 px-4 md:px-12 fixed top-0 left-0 bg-white z-20 border-b">
        <div className="flex items-center gap-2">
          <span className="inline-block w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#0ea5e9" />
            </svg>
          </span>
          <span className="font-bold text-lg text-gray-800">Connecto</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#solutions" className="hover:text-blue-600 transition">Solutions</a>
          <a href="#resources" className="hover:text-blue-600 transition">Resources</a>
          <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
        </div>
        <Link
          to={user ? "/dashboard" : "/login"}
          className="bg-black text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-gray-800 transition"
        >
          {user ? "Dashboard" : "Join Now"}
        </Link>
      </nav>

      {/* Main Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto pt-32 md:pt-40 px-4 md:px-8 gap-10 grow">
        {/* Left: Text */}
        <div className="flex-1 text-left max-w-xl">
          <p className="uppercase text-xs tracking-widest text-blue-500 font-semibold mb-2">A social media for learners</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Connect &amp;<br className="hidden md:block" />
            learn from the experts
          </h1>
          <p className="text-gray-600 mb-7 text-lg">
            Grow your career fast with the right mentor.
          </p>
          <div className="flex items-center gap-4 mb-2 flex-wrap">

            <Link
              to={user ? "/dashboard" : "/register"}
              className="px-7 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full shadow transition text-base flex items-center gap-2"
            >
              {!user ? 'Join for free' : 'Go to Dashboard'}
              <span className="inline-block">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="#000" strokeWidth="2"/>
                  <path d="M10 8l4 4-4 4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
            {!user && (
              <span className="text-gray-500 text-sm">
                Already joined?{' '}
                <Link to="/login" className="underline hover:text-blue-600 transition">Log in</Link>
              </span>
            )}
          </div>
        </div>

        {/* Right: Styled Graphics */}
        <div className="flex-1 flex items-center justify-center relative min-h-[420px] w-full max-w-lg">
          {/* Main grid for shapes and images */}
          <div className="grid grid-cols-3 grid-rows-3 gap-4 w-[340px] h-[370px] relative">
            {/* Top left - yellow circle with image */}
            <div className="col-start-1 row-start-1 flex items-center justify-center z-10">
              <div className="rounded-full bg-yellow-300 w-24 h-24 flex items-center justify-center shadow-lg">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Mentor"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white"
                />
              </div>
            </div>
            {/* Top right - purple rounded with image */}
            <div className="col-start-3 row-start-1 flex items-center justify-center z-10">
              <div className="rounded-[32px] bg-purple-300 w-24 h-24 flex items-center justify-center shadow-lg">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Mentor"
                  className="w-20 h-20 rounded-[28px] object-cover border-4 border-white"
                />
              </div>
            </div>
            {/* Center left - blue rounded with image */}
            <div className="col-start-1 row-start-2 flex items-center justify-center z-10">
              <div className="rounded-[32px] bg-blue-500 w-28 h-28 flex items-center justify-center shadow-lg">
                <img
                  src="https://randomuser.me/api/portraits/women/65.jpg"
                  alt="Mentee"
                  className="w-20 h-20 rounded-[24px] object-cover border-4 border-white"
                />
              </div>
            </div>
            {/* Center - black stat */}
            <div className="col-start-2 row-start-2 flex items-center justify-center z-20">
              <div className="rounded-full bg-black text-white w-32 h-32 flex flex-col items-center justify-center shadow-lg">
                <span className="text-xs text-center">Active Professionals</span>
                <span className="text-2xl font-bold mt-1">13,422</span>
              </div>
            </div>
            {/* Center right - green stat */}
            <div className="col-start-3 row-start-2 flex items-center justify-center z-20">
              <div className="rounded-3xl bg-green-200 w-32 h-20 flex flex-col items-center justify-center shadow-lg">
                <span className="text-xs text-gray-700">Online Courses</span>
                <span className="text-xl font-bold text-gray-900 mt-1">2,582</span>
              </div>
            </div>
            {/* Bottom left - yellow quarter circle */}
            <div className="col-start-1 row-start-3 flex items-center justify-center">
              <div className="w-16 h-16 bg-yellow-300 rounded-bl-[48px]"></div>
            </div>
            {/* Bottom right - red circle */}
            <div className="col-start-3 row-start-3 flex items-center justify-center">
              <div className="w-8 h-8 bg-red-400 rounded-full"></div>
            </div>
            {/* Center - star and triangle icons */}
            <div className="col-start-2 row-start-3 flex flex-col items-center justify-center gap-2">
              <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
                <path d="M18 6v24M6 18h24M10 10l16 16M26 10L10 26" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                <polygon points="9,3 16,15 2,15" fill="none" stroke="#222" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by logos */}
      {/* <div className="w-full flex flex-col items-center mt-16 mb-6">
        <span className="text-gray-400 text-xs mb-2">Trusted by world class creators</span>
        <div className="flex gap-8 opacity-70 flex-wrap justify-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Googleplex-Logo.svg" alt="Brand1" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_TV_2015.png" alt="Brand2" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Brand3" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Brand4" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Amazon_logo.svg" alt="Brand5" className="h-6" />
        </div>
      </div> */}

      {/* Animations */}
      <style>
        {`
          .animate-float {
            animation: floatY 3s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: floatY 5s ease-in-out infinite;
          }
          .animate-float-reverse {
            animation: floatYReverse 4s ease-in-out infinite;
          }
          @keyframes floatY {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-18px); }
          }
          @keyframes floatYReverse {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(18px); }
          }
        `}
      </style>
    </main>
      );
};

export default HomePage;
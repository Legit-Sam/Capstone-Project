import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm px-4 md:px-8 py-3 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="inline-block w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm">
          <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="12" fill="#0ea5e9" />
            <text
              x="14"
              y="18"
              textAnchor="middle"
              fontSize="16"
              fill="#fff"
              fontFamily="Arial"
              fontWeight="bold"
              alignmentBaseline="middle"
              dominantBaseline="middle"
            >
              C
            </text>
          </svg>
        </span>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-blue-700">Connecto</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm font-medium">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#0ea5e9"/><path d="M4 20c0-2.2 3.6-4 8-4s8 1.8 8 4" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round"/></svg>
          {user?.profile?.name || "User"}
        </span>
        <button
          onClick={logout}
          className="bg-red-500 text-white text-sm md:text-base px-4 py-1.5 rounded-full shadow hover:bg-red-600 transition flex items-center gap-2"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M16 17l5-5m0 0l-5-5m5 5H9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 5v-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
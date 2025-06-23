// src/layouts/DashboardLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Menu, X } from "lucide-react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-blue-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64 bg-white shadow-md h-full">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Nav */}
        <div className="md:hidden bg-white shadow p-4 flex justify-between items-center sticky top-0 z-30">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <button onClick={() => setSidebarOpen(true)} aria-label="Open Sidebar">
            <Menu size={24} />
          </button>
        </div>

        <Navbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

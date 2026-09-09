import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Navigation Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area + Top Header */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72 transition-all duration-300">
        {/* Top Header Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        {/* Page Views Container */}
        <main className="flex-1 pt-16 min-h-[calc(100vh-64px)] pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

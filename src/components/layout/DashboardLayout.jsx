import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  // Helper to get page title based on path
  const getPageTitle = (path) => {
    if (path === '/dashboard') return 'Student Dashboard';
    if (path === '/lessons') return 'My Lessons';
    if (path === '/live') return 'Live Classes';
    if (path === '/practice') return 'Practice Center';
    if (path === '/exam') return 'Mock Exam Simulator';
    if (path === '/upgrade') return 'Premium PassPort';
    if (path === '/leaderboard') return 'Leaderboard';
    return 'PassPort';
  };

  return (
    <div className="app-shell">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(v => !v)} 
      />
      <div className="app-main">
        <Topbar 
          title={getPageTitle(location.pathname)} 
          onMenuClick={() => setCollapsed(false)}
        />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

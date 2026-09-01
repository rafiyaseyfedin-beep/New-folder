import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div className="dashboard-container">
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <div className="main-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main className="content-area" style={{ flex: 1 }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

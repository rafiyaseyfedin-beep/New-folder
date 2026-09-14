import React from 'react';
import { useApp } from '../context/AppContext';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import ManagerDashboard from '../components/dashboards/ManagerDashboard';
import MemberDashboard from '../components/dashboards/MemberDashboard';

export default function Home() {
  const { currentRole } = useApp();

  if (currentRole === 'ADMIN') {
    return <AdminDashboard />;
  }

  if (currentRole === 'PROJECT_MANAGER') {
    return <ManagerDashboard />;
  }

  return <MemberDashboard />;
}

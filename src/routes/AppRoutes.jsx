import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/Home';
import Projects from '../pages/Projects';
import Tasks from '../pages/Tasks';
import Teams from '../pages/Teams';
import Reports from '../pages/Reports';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import Users from '../pages/Users';
import Chat from '../pages/Chat';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Landing from '../pages/Landing';
import NotFound from '../pages/NotFound';
import Logout from '../pages/Logout';
import Settings from '../pages/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root & Landing Page */}
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />

      {/* Main Dashboard Portal Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/users" element={<Users />} />
      </Route>

      {/* Top-Level 404 Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ReportsPage from './ReportsPage';
// Import other pages when available
// import ExecutionPage from './ExecutionPage';
// import SchedulerPage from './SchedulerPage';
import './menu.css';

const DashboardLayout = () => {
  return (
    <div className="layout-container">
      {/* Top Bar - Can be your logo or user profile section */}
      <header className="top-bar">
        <div> Reports Dashboard</div>
      </header>
      
      {/* Sidebar Navigation */}
      <nav className="side-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/execution">Execution</Link></li>
          <li><Link to="/scheduler">Scheduler</Link></li>
          <li><Link to="/reports">Reports</Link></li>
        </ul>
      </nav>
      
      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<div>Welcome to the Dashboard</div>} />
          <Route path="/execution" element={<div>Execution Page Placeholder</div>} />
          <Route path="/scheduler" element={<div>Scheduler Page Placeholder</div>} />
          <Route path="/reports" element={<ReportsPage />} />
          {/* Add more routes for other pages as needed */}
        </Routes>
      </main>
    </div>
  );
};

export default DashboardLayout;

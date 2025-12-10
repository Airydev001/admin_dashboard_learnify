import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CreateSubject from './components/CreateSubject';
import CreateLesson from './components/CreateLesson';
import './index.css';

const SidebarLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
        }`}
    >
      {children}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-xl z-10 hidden md:flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-indigo-600">Galaxy Admin</h1>
            <p className="text-xs text-gray-400 mt-1">Learning Adventure</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <SidebarLink to="/">Dashboard</SidebarLink>
            <SidebarLink to="/create-subject">Create Subject</SidebarLink>
            <SidebarLink to="/create-lesson">Create Lesson</SidebarLink>
          </nav>
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-400">admin@galaxy.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <header className="bg-white shadow-sm p-4 md:hidden flex justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-600">Galaxy Admin</h1>
            {/* Mobile menu button placeholder */}
            <button className="text-gray-500">Menu</button>
          </header>

          <div className="p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Manage your learning content, subjects, and lessons from this dashboard.
                    Select an option from the sidebar to get started.
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/create-subject" className="p-6 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100">
                      <h3 className="text-lg font-semibold text-indigo-700 mb-2">Add New Subject</h3>
                      <p className="text-sm text-indigo-600/80">Create a new learning track for students.</p>
                    </Link>
                    <Link to="/create-lesson" className="p-6 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100">
                      <h3 className="text-lg font-semibold text-emerald-700 mb-2">Create Lesson</h3>
                      <p className="text-sm text-emerald-600/80">Build interactive lessons with AI support.</p>
                    </Link>
                  </div>
                </div>
              } />
              <Route path="/create-subject" element={<CreateSubject />} />
              <Route path="/create-lesson" element={<CreateLesson />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;

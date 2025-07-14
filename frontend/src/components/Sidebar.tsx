import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/analyze', label: 'Analyze Repo', icon: '📊' },
    { path: '/metrics', label: 'Metrics', icon: '📈' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <Link to="/">
          <h1 className="text-2xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer">DevInsight</h1>
        </Link>
        <p className="text-gray-400 text-sm mt-1">Code Quality Analysis</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <p>Backend Status: <span className="text-green-400">Connected</span></p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 
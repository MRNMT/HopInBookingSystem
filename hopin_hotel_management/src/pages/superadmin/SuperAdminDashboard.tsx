import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SuperAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.full_name}</h2>
          <p className="text-gray-600">
            You have full access to manage the system, including creating other administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin Management Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold mb-2">Manage Admins</h3>
            <p className="text-gray-600 mb-4">Create and manage system administrators.</p>
            <button className="text-blue-600 font-medium hover:underline">
              View Admins &rarr;
            </button>
          </div>

          {/* System Stats Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold mb-2">System Statistics</h3>
            <p className="text-gray-600 mb-4">View overall system performance and metrics.</p>
            <button className="text-green-600 font-medium hover:underline">
              View Stats &rarr;
            </button>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold mb-2">System Settings</h3>
            <p className="text-gray-600 mb-4">Configure global system parameters.</p>
            <button className="text-purple-600 font-medium hover:underline">
              Settings &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

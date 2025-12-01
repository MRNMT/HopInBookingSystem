import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { Users, UserPlus, Shield, Activity, User, LogOut, ChevronDown } from 'lucide-react';
import { superAdminService } from '../services/superadmin.service';
import { CreateAdminModal } from '../components/CreateAdminModal';
import { LogoutConfirmationDialog } from '../components/LogoutConfirmationDialog';

interface AdminStats {
  totalAdmins: number;
  totalSuperAdmins: number;
  recentAdmins: any[];
}

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalAdmins: 0,
    totalSuperAdmins: 0,
    recentAdmins: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const admins = await superAdminService.getAllAdmins();
      
      const adminCount = admins.filter(a => a.role === 'admin').length;
      const superAdminCount = admins.filter(a => a.role === 'superadmin').length;
      const recent = admins.slice(0, 5);

      setStats({
        totalAdmins: adminCount,
        totalSuperAdmins: superAdminCount,
        recentAdmins: recent,
      });
    } catch (error: any) {
      console.error('Failed to load stats:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
    setShowDropdown(false);
  };

  const confirmLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowLogoutDialog(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white text-gray-800 border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Super Admin</h1>
              </div>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium shadow-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/superadmin/profile');
                        }}
                        className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 font-medium transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 mb-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">System Administrator Access</h2>
            </div>
            <p className="text-blue-100 font-medium max-w-2xl">
              You have full access to manage the system, including creating and managing administrator accounts. Monitor system health and user statistics from this dashboard.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Admins</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalAdmins}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Super Admins</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalSuperAdmins}
                  </p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">System Status</p>
                  <p className="text-xl font-bold text-green-600">Operational</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-100 p-6 mb-8 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <UserPlus className="w-5 h-5" />
                Create Admin
              </button>
              <button
                onClick={() => navigate('/superadmin/admins')}
                className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-lg transition-all font-medium"
              >
                <Users className="w-5 h-5" />
                View All Admins
              </button>
            </div>
          </div>

          {/* Recent Admins */}
          <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Admins</h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 font-medium mb-2">{error}</p>
                <button 
                  onClick={loadStats}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                >
                  Try Again
                </button>
              </div>
            ) : stats.recentAdmins.length === 0 ? (
              <p className="text-gray-400 text-center py-8 font-medium">No admins found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentAdmins.map((admin) => (
                      <tr 
                        key={admin.id} 
                        className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs">
                              {admin.full_name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{admin.full_name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 font-medium">{admin.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            admin.role === 'superadmin' 
                              ? 'bg-indigo-100 text-indigo-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm font-medium">
                          {formatDate(admin.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CreateAdminModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadStats();
          setShowCreateModal(false);
        }}
      />

      <LogoutConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};

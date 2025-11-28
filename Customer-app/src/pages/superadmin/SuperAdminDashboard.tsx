import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store/store';
import { logout } from '../../store/authSlice';
import { Users, UserPlus, Shield, Activity, User, LogOut, ChevronDown } from 'lucide-react';
import { superAdminService } from '../../services/superadmin.service';
import { CreateAdminModal } from '../../components/CreateAdminModal';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const admins = await superAdminService.getAllAdmins();
      
      const adminCount = admins.filter(a => a.role === 'admin').length;
      const superAdminCount = admins.filter(a => a.role === 'superadmin').length;
      const recent = admins.slice(0, 5);

      setStats({
        totalAdmins: adminCount,
        totalSuperAdmins: superAdminCount,
        recentAdmins: recent,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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
      <div className="min-h-screen bg-white">
        {/* Header with Profile & Logout */}
        <div className="bg-black text-white border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" />
                <h1 className="text-xl font-light">Super Admin</h1>
              </div>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-light">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-light">{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/superadmin/profile');
                        }}
                        className="w-full text-left px-4 py-2 text-black hover:bg-gray-100 flex items-center gap-2 font-light"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-black hover:bg-gray-100 flex items-center gap-2 font-light"
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
          <div className="bg-black text-white p-8 mb-8 border border-black">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6" />
              <h2 className="text-xl font-light">System Administrator Access</h2>
            </div>
            <p className="text-gray-300 font-light">
              You have full access to manage the system, including creating and managing administrator accounts.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-300 p-6 hover:border-black transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-light mb-2">Total Admins</p>
                  <p className="text-4xl font-light text-black">
                    {loading ? '...' : stats.totalAdmins}
                  </p>
                </div>
                <div className="bg-gray-100 p-3">
                  <Users className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 p-6 hover:border-black transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-light mb-2">Super Admins</p>
                  <p className="text-4xl font-light text-black">
                    {loading ? '...' : stats.totalSuperAdmins}
                  </p>
                </div>
                <div className="bg-gray-100 p-3">
                  <Shield className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 p-6 hover:border-black transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-light mb-2">System Status</p>
                  <p className="text-xl font-normal text-black">Operational</p>
                </div>
                <div className="bg-gray-100 p-3">
                  <Activity className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-light text-black mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-light"
              >
                <UserPlus className="w-5 h-5" />
                Create Admin
              </button>
              <button
                onClick={() => navigate('/superadmin/admins')}
                className="flex items-center gap-2 px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors font-light"
              >
                <Users className="w-5 h-5" />
                View All Admins
              </button>
            </div>
          </div>

          {/* Recent Admins */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-xl font-light text-black mb-4">Recent Admins</h3>
            
            {loading ? (
              <p className="text-gray-400 text-center py-8 font-light">Loading...</p>
            ) : stats.recentAdmins.length === 0 ? (
              <p className="text-gray-400 text-center py-8 font-light">No admins found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-normal text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-normal text-gray-600">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-normal text-gray-600">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-normal text-gray-600">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentAdmins.map((admin) => (
                      <tr 
                        key={admin.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-black font-light">{admin.full_name}</td>
                        <td className="py-3 px-4 text-gray-600 font-light">{admin.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-light border ${
                            admin.role === 'superadmin' 
                              ? 'border-black text-black' 
                              : 'border-gray-400 text-gray-700'
                          }`}>
                            {admin.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm font-light">
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
    </>
  );
};

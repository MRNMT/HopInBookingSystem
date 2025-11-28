import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store/store';

import { Button } from '../../components/Button';
import { Users, UserPlus, Shield, Activity } from 'lucide-react';
import { superAdminService } from '../../services/superadmin.service';
import { CreateAdminModal } from '../../components/CreateAdminModal';

interface AdminStats {
  totalAdmins: number;
  totalSuperAdmins: number;
  recentAdmins: any[];
}

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalAdmins: 0,
    totalSuperAdmins: 0,
    recentAdmins: [],
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, <span className="font-semibold">{user?.name}</span>
            </p>
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-8 h-8" />
              <h2 className="text-2xl font-bold">System Administrator Access</h2>
            </div>
            <p className="text-blue-100">
              You have full access to manage the system, including creating and managing administrator accounts.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Admins */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Admins</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalAdmins}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Super Admins */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Super Admins</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalSuperAdmins}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">System Status</p>
                  <p className="text-xl font-bold text-green-600">Healthy</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create Admin
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/superadmin/admins')}
                className="flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                View All Admins
              </Button>
            </div>
          </div>

          {/* Recent Admins */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Admins</h3>
            
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : stats.recentAdmins.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No admins found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentAdmins.map((admin, index) => (
                      <tr 
                        key={admin.id} 
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-4 text-gray-900">{admin.full_name}</td>
                        <td className="py-3 px-4 text-gray-600">{admin.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            admin.role === 'superadmin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {admin.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
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
      
      {/* Create Admin Modal */}
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

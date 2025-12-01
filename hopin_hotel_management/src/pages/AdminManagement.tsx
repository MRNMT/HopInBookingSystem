import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { Search, UserPlus, Trash2, ArrowLeft, Shield, User, LogOut, ChevronDown } from 'lucide-react';
import { superAdminService } from '../services/superadmin.service';
import { CreateAdminModal } from '../components/CreateAdminModal'
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { LogoutConfirmationDialog } from '../components/LogoutConfirmationDialog';

interface Admin {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'superadmin';
  created_at: string;
}

export const AdminManagement: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAdmins(admins);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredAdmins(
        admins.filter(
          (admin) =>
            admin.full_name.toLowerCase().includes(query) ||
            admin.email.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, admins]);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await superAdminService.getAllAdmins();
      // Filter to only include admin and superadmin users
      const adminUsers = data.filter(
        (user) => user.role === 'admin' || user.role === 'superadmin'
      ) as Admin[];
      setAdmins(adminUsers);
      setFilteredAdmins(adminUsers);
    } catch (error: any) {
      console.error('Failed to load admins:', error);
      setError(error.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (admin: Admin) => {
    if (admin.id === user?.id) {
      alert('You cannot delete your own account!');
      return;
    }
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAdmin) return;

    try {
      setDeleteLoading(true);
      await superAdminService.deleteAdmin(selectedAdmin.id);
      setShowDeleteModal(false);
      setSelectedAdmin(null);
      await loadAdmins();
    } catch (error: any) {
      alert(error.message || 'Failed to delete admin');
    } finally {
      setDeleteLoading(false);
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
        {/* Header with Profile & Logout */}
        <div className="bg-white text-gray-800 border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Super Admin</h1>
              </div>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
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
          <div className="mb-8">
            <button
              onClick={() => navigate('/superadmin')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
                <p className="text-gray-500 font-medium">Manage system administrators and their access</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <UserPlus className="w-5 h-5" />
                Create Admin
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4 mb-6 rounded-xl shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 overflow-hidden rounded-xl shadow-sm">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <p className="text-red-500 text-lg font-medium mb-2">{error}</p>
                <button 
                  onClick={loadAdmins}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Try Again
                </button>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-lg font-medium">
                  {searchQuery ? 'No admins match your search' : 'No admins found'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${
                              admin.role === 'superadmin' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {admin.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{admin.full_name}</p>
                              {admin.id === user?.id && (<span className="text-xs text-blue-600 font-medium">(You)</span>)}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600 font-medium">{admin.email}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                            admin.role === 'superadmin' 
                              ? 'bg-indigo-100 text-indigo-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {admin.role === 'superadmin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-500 text-sm font-medium">{formatDate(admin.created_at)}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteClick(admin)}
                            disabled={admin.id === user?.id}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              admin.id === user?.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-gray-500 font-medium text-sm">
            <p>Showing {filteredAdmins.length} of {admins.length} admin{admins.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <CreateAdminModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadAdmins();
          setShowCreateModal(false);
        }}
      />

      {selectedAdmin && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAdmin(null);
          }}
          onConfirm={handleDeleteConfirm}
          adminName={selectedAdmin.full_name}
          adminEmail={selectedAdmin.email}
          loading={deleteLoading}
        />

      <LogoutConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};

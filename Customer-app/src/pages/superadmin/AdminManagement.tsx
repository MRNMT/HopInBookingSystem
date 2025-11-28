import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store/store';
import { logout } from '../../store/authSlice';
import { Search, UserPlus, Trash2, ArrowLeft, Shield, User, LogOut, ChevronDown } from 'lucide-react';
import { superAdminService } from '../../services/superadmin.service';
import { CreateAdminModal } from '../../../src/components/CreateAdminModal'
import { DeleteConfirmationModal } from '../../components/DeleteConfirmationModal';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
      const data = await superAdminService.getAllAdmins();
      setAdmins(data);
      setFilteredAdmins(data);
    } catch (error) {
      console.error('Failed to load admins:', error);
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
          <div className="mb-8">
            <button
              onClick={() => navigate('/superadmin')}
              className="flex items-center gap-2 text-black hover:text-gray-600 mb-4 transition-colors font-light"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-light">Back to Dashboard</span>
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6">
              <div>
                <h1 className="text-4xl font-light text-black mb-2">Admin Management</h1>
                <p className="text-gray-500 font-light">Manage system administrators and their access</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-light"
              >
                <UserPlus className="w-5 h-5" />
                Create Admin
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 font-light">Loading admins...</p>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-lg font-light">
                  {searchQuery ? 'No admins match your search' : 'No admins found'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-normal text-gray-600">Admin</th>
                      <th className="text-left py-4 px-6 text-sm font-normal text-gray-600">Email</th>
                      <th className="text-left py-4 px-6 text-sm font-normal text-gray-600">Role</th>
                      <th className="text-left py-4 px-6 text-sm font-normal text-gray-600">Created</th>
                      <th className="text-right py-4 px-6 text-sm font-normal text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 border ${
                              admin.role === 'superadmin' ? 'border-black bg-black text-white' : 'border-gray-400 bg-white text-black'
                            } flex items-center justify-center font-light`}>
                              {admin.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-light text-black">{admin.full_name}</p>
                              {admin.id === user?.id && (<span className="text-xs text-gray-500 font-light">(You)</span>)}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600 font-light">{admin.email}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-light border ${
                            admin.role === 'superadmin' ? 'border-black text-black' : 'border-gray-400 text-gray-700'
                          }`}>
                            {admin.role === 'superadmin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            {admin.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm font-light">{formatDate(admin.created_at)}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteClick(admin)}
                            disabled={admin.id === user?.id}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-light transition-colors ${
                              admin.id === user?.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'border border-black text-black hover:bg-black hover:text-white'
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

          <div className="mt-6 text-center text-gray-500 font-light">
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
      )}
    </>
  );
};

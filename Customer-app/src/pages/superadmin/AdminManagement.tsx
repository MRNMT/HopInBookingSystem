import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store/store';

import { Button } from '../../components/Button';
import { Search, UserPlus, Trash2, ArrowLeft, Shield, User } from 'lucide-react';
import { superAdminService } from '../../services/superadmin.service';
import { CreateAdminModal } from '../../components/CreateAdminModal';
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
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  useEffect(() => {
    // Filter admins based on search query
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
            <button
              onClick={() => navigate('/superadmin')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Admin Management
                </h1>
                <p className="text-gray-600">
                  Manage system administrators and their access
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create Admin
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Admin List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">Loading admins...</p>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchQuery ? 'No admins match your search' : 'No admins found'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                        Admin
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                        Role
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                        Created
                      </th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((admin, index) => (
                      <tr
                        key={admin.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              admin.role === 'superadmin' ? 'bg-purple-600' : 'bg-blue-600'
                            }`}>
                              {admin.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{admin.full_name}</p>
                              {admin.id === user?.id && (
                                <span className="text-xs text-blue-600 font-medium">(You)</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {admin.email}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                            admin.role === 'superadmin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {admin.role === 'superadmin' ? (
                              <Shield className="w-4 h-4" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                            {admin.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">
                          {formatDate(admin.created_at)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteClick(admin)}
                            disabled={admin.id === user?.id}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              admin.id === user?.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
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

          {/* Summary */}
          <div className="mt-6 text-center text-gray-600">
            <p>
              Showing {filteredAdmins.length} of {admins.length} admin{admins.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { ArrowLeft, Shield, User, LogOut, ChevronDown, Mail, Calendar } from 'lucide-react';
import { LogoutConfirmationDialog } from '../components/LogoutConfirmationDialog';

export const SuperAdminProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(true);
    setShowDropdown(false);
  };

  const confirmLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowLogoutDialog(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/superadmin')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 mb-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white text-blue-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-inner">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
              <p className="text-blue-100 font-medium text-lg">Super Administrator</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white border border-gray-100 p-8 mb-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 pb-6 border-b border-gray-50">
              <div className="p-2 bg-white rounded-lg">
                <Mail className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Email Address</p>
                <p className="text-gray-900 font-semibold mt-1 text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-6 border-b border-gray-50">
              <div className="p-2 bg-white rounded-lg">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Role</p>
                <p className="text-gray-900 font-medium mt-1">
                  <span className="inline-flex items-center px-1 py-1 text-black text-sm font-bold">
                    Super Administrator
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Account Created</p>
                <p className="text-gray-900 font-medium mt-1 text-lg">{formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LogoutConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

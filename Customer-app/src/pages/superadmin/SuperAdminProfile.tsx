import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store/store';
import { logout } from '../../store/authSlice';
import { ArrowLeft, Shield, User, LogOut, ChevronDown, Mail, Calendar } from 'lucide-react';

export const SuperAdminProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/superadmin')}
          className="flex items-center gap-2 text-black hover:text-gray-600 mb-6 transition-colors font-light"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-light">Back to Dashboard</span>
        </button>

        {/* Profile Header */}
        <div className="bg-black text-white p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white text-black flex items-center justify-center text-4xl font-light">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-light mb-2">{user?.name}</h1>
              <p className="text-gray-300 font-light">Super Administrator</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-light text-black mb-6">Account Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <Mail className="w-5 h-5 text-gray-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-light">Email Address</p>
                <p className="text-black font-light mt-1">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <Shield className="w-5 h-5 text-gray-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-light">Role</p>
                <p className="text-black font-light mt-1">
                  <span className="inline-flex items-center px-3 py-1 border border-black text-black text-sm">
                    Super Administrator
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Calendar className="w-5 h-5 text-gray-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-light">Account Created</p>
                <p className="text-black font-light mt-1">{formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-gray-50 border border-gray-300 p-6">
          <h3 className="text-lg font-light text-black mb-3">Security Information</h3>
          <p className="text-gray-700 font-light text-sm">
            As a super administrator, you have full system access. Your account is secured with the highest level of permissions.
            If you need to change your password or update security settings, please contact the system owner.
          </p>
        </div>
      </div>
    </div>
  );
};

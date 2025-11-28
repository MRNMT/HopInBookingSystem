import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { superAdminService } from '../services/superadmin.service';

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@hopinAdmin.email')) {
      newErrors.email = 'Admin email must end with @hopinAdmin.email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await superAdminService.createAdmin({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage('Admin created successfully!');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create admin' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setSuccessMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-black max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-black text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-light">Create Admin Account</h2>
          <button onClick={handleClose} className="hover:bg-gray-800 p-1 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {successMessage && (
          <div className="mx-6 mt-6 p-4 bg-gray-100 border border-black flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
            <p className="text-black font-light">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-light text-black mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`w-full px-4 py-2 border ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:border-black transition-colors font-light`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1 font-light">
                <AlertCircle className="w-4 h-4" />
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-light text-black mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:border-black transition-colors font-light`}
              placeholder="admin@hopinAdmin.email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1 font-light">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-light text-black mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:border-black transition-colors font-light`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1 font-light">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-light text-black mb-2">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`w-full px-4 py-2 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:border-black transition-colors font-light`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1 font-light">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-500">
              <p className="text-red-800 text-sm flex items-center gap-2 font-light">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-black text-black hover:bg-gray-100 transition-colors font-light"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors font-light"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

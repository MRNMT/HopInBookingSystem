import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  adminName: string;
  adminEmail: string;
  loading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  adminName,
  adminEmail,
  loading = false,
}) => {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-red-50 border-b border-red-100 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-900">Confirm Deletion</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-red-400 hover:text-red-600 hover:bg-red-100 p-2 rounded-full transition-all"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-gray-600 font-medium">
            Are you sure you want to delete this admin account?
          </p>
          
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Name</p>
            <p className="font-medium text-gray-900 text-lg mb-3">{adminName}</p>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Email</p>
            <p className="font-medium text-gray-900">{adminEmail}</p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm font-medium">
              <strong className="font-bold">Warning:</strong> This action cannot be undone. The admin will lose access immediately.
            </p>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Admin'}
          </button>
        </div>
      </div>
    </div>
  );
};

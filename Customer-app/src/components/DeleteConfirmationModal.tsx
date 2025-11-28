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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-black max-w-md w-full">
        <div className="bg-black text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-xl font-light">Confirm Deletion</h2>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-gray-800 p-1 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-700 font-light">
            Are you sure you want to delete this admin account?
          </p>
          
          <div className="bg-gray-50 border border-gray-300 p-4">
            <p className="text-sm text-gray-600 mb-1 font-light">Name</p>
            <p className="font-light text-black">{adminName}</p>
            <p className="text-sm text-gray-600 mt-3 mb-1 font-light">Email</p>
            <p className="font-light text-black">{adminEmail}</p>
          </div>

          <div className="bg-gray-100 border border-gray-400 p-4">
            <p className="text-gray-800 text-sm font-light">
              <strong className="font-normal">Warning:</strong> This action cannot be undone. The admin will lose access immediately.
            </p>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-black text-black hover:bg-gray-100 transition-colors font-light"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors font-light"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Admin'}
          </button>
        </div>
      </div>
    </div>
  );
};

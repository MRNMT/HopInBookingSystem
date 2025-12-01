import React from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmationDialog: React.FC<LogoutConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-blue-50 border-b border-blue-100 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <LogOut className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-blue-900">Confirm Logout</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-blue-400 hover:text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600 font-medium">
            Are you sure you want to log out? You will need to sign in again to access the super admin panel.
          </p>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};


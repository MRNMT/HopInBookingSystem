import React from 'react';
import { CreditCard, X } from 'lucide-react';
import { Button } from './Button';

interface PaymentConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
  loading?: boolean;
}

export const PaymentConfirmationDialog: React.FC<PaymentConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-green-50 border-b border-green-100 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-900">Confirm Payment</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-green-400 hover:text-green-600 hover:bg-green-100 p-2 rounded-full transition-all"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600 font-medium">
            You are about to process a payment of <span className="font-bold text-gray-900">R{amount.toFixed(2)}</span>.
          </p>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Please ensure your payment details are correct. This action will charge your payment method.
            </p>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Confirm Payment`}
          </Button>
        </div>
      </div>
    </div>
  );
};


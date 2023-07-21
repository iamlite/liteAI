import React from 'react';

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationDialog({
  message,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-base-300 opacity-50" />
      <div className="bg-base-100 rounded-lg shadow-lg p-6 mx-4 sm:mx-auto w-full sm:max-w-md relative">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Confirmation</h2>
          <p className="text-base-content">{message}</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            className="btn btn-primary btn-outline"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button type="button" className="btn btn-neutral" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;

import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

interface ActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  isOpen,
  onClose,
  position,
  onEdit,
  onDelete,
  onView,
}) => {
  if (!isOpen) return null;

  const handleEdit = () => {
    onEdit?.();
    onClose();
  };

  const handleDelete = () => {
    onDelete?.();
    onClose();
  };

  const handleView = () => {
    onView?.();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div
        className="absolute bg-white shadow-lg rounded-md border w-40 py-2"
        style={{ top: position.y, left: position.x }}
        onClick={(e) => e.stopPropagation()}
      >
        {onView && (
          <button 
            onClick={handleView}
            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            <FaEye className="text-blue-500"/> 
            <span>View</span>
          </button>
        )}
        {onEdit && (
          <button 
            onClick={handleEdit}
            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            <FaEdit className="text-green-500"/>
            <span>Edit</span>
          </button>
        )}
        {onDelete && (
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            <RiDeleteBin5Line className="text-red-500"/> 
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

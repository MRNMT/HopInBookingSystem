import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";


interface ActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  isOpen,
  onClose,
  position,
}) => {
  if (!isOpen) return null;

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
        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
         <FaEye className="text-yellow-200"/> View
        </button>
        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
          <FaEdit className="text-green-300"/>Edit
        </button>
        <button className="block w-full text-left px-4 py-2  hover:bg-gray-100">
          <RiDeleteBin5Line className="text-red-500"/> Delete
        </button>
      </div>
    </div>
  );
};

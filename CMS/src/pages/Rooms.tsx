import { useState } from "react";
import { SideBar } from '../components/SideBar';
import { Button } from '../components/Button';
import { FaEllipsisH } from "react-icons/fa";
import { ActionMenu } from "../components/ActionMenu";

export const Rooms = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const openMenu = (e: any) => {
    const rect = e.target.getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom });
    setMenuOpen(true);
  };

  return (
    <div className="flex">
      <SideBar />

      <div className="flex-1 ml-64 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Rooms</h1>
            <p className="text-gray-500">Manage hotel rooms and availability</p>
          </div>

          <Button variant="secondary">Add Room</Button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-3 px-4 font-semibold">Room ID</th>
                <th className="py-3 px-4 font-semibold">Room Type</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Capacity</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Row 1 */}
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">R101</td>
                <td className="py-3 px-4">Deluxe Suite</td>
                <td className="py-3 px-4">Gauteng</td>
                <td className="py-3 px-4">4 Guests</td>
                <td className="py-3 px-4">R250</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 text-black bg-blue-400 rounded-full text-sm">
                    Available
                  </span>
                </td>
                <td className="py-3 px-4">
                  <FaEllipsisH
                    className="text-blue-500 cursor-pointer"
                    onClick={openMenu}
                  />
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">R102</td>
                <td className="py-3 px-4">Executive Suite</td>
                <td className="py-3 px-4">Cape Town</td>
                <td className="py-3 px-4">2 Guests</td>
                <td className="py-3 px-4">R300</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 text-black bg-blue-300 rounded-full text-sm">
                    Occupied
                  </span>
                </td>
                <td className="py-3 px-4">
                  <FaEllipsisH
                    className="text-blue-500 cursor-pointer"
                    onClick={openMenu}
                  />
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">R103</td>
                <td className="py-3 px-4">Standard Room</td>
                <td className="py-3 px-4">Durban</td>
                <td className="py-3 px-4">2 Guests</td>
                <td className="py-3 px-4">R180</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 text-black bg-blue-100 rounded-full text-sm">
                    Maintenance
                  </span>
                </td>
                <td className="py-3 px-4">
                  <FaEllipsisH
                    className="text-blue-500 cursor-pointer"
                    onClick={openMenu}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Menu Component */}
        <ActionMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          position={menuPosition}
        />

      </div>
    </div>
  );
};

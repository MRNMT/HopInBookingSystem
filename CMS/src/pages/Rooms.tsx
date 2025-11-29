import { useState, useEffect } from "react";
import { SideBar } from "../components/SideBar";
import { Button } from "../components/Button";
import { FaEllipsisH } from "react-icons/fa";
import { ActionMenu } from "../components/ActionMenu";
import { AddRoomModal } from "../components/AddRoomModal";
import { adminService, type Accommodation } from "../services/admin.service";

export const Rooms = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [rooms, setRooms] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAccommodations();
      console.log('Fetched accommodations:', data);
      setRooms(data);
    } catch (error: any) {
      console.error("Failed to fetch rooms", error);
      setError(error.response?.data?.message || "Failed to fetch accommodations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800">Accomodations</h1>
            <p className="text-gray-500">Manage hotel accommodations and availability</p>
          </div>

          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Add Accommodation
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-3 px-4 font-semibold">Room ID</th>
                <th className="py-3 px-4 font-semibold">Room Type</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">Loading accommodations...</td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">No accommodations found.</td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{room.id.substring(0, 8)}...</td>
                    <td className="py-3 px-4">{room.name}</td>
                    <td className="py-3 px-4">{room.city}</td>
                    <td className="py-3 px-4">R{room.price_per_night}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Action Menu */}
        <ActionMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          position={menuPosition}
        />

        {/* Add Room Modal */}
        {modalOpen && (
          <AddRoomModal onClose={() => setModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

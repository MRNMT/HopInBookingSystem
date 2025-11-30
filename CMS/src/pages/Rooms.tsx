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
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<string | null>(null);

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

  const openMenu = (e: React.MouseEvent, accommodationId: string) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom });
    setSelectedAccommodationId(accommodationId);
    setMenuOpen(true);
  };

  const handleEdit = () => {
    const accommodation = rooms.find(r => r.id === selectedAccommodationId);
    if (accommodation) {
      setSelectedAccommodation(accommodation);
      setModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedAccommodationId) return;
    
    if (window.confirm('Are you sure you want to delete this accommodation? This action cannot be undone.')) {
      try {
        setError(null);
        await adminService.deleteAccommodation(selectedAccommodationId);
        // Refresh the list after successful deletion
        await fetchRooms();
      } catch (error: any) {
        console.error("Failed to delete accommodation", error);
        setError(error.response?.data?.message || "Failed to delete accommodation. Please try again.");
      }
    }
  };

  const handleAddNew = () => {
    setSelectedAccommodation(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAccommodation(null);
  };

  const handleModalSuccess = async () => {
    // Refresh the list after successful create/update
    await fetchRooms();
  };

  return (
    <div className="flex">
      <SideBar />

      <div className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 md:p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Accommodations</h1>
            <p className="text-gray-500 text-sm">Manage hotel accommodations and availability</p>
          </div>

          <Button variant="secondary" onClick={handleAddNew}>
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
                <th className="py-3 px-4 font-semibold">Accommodation ID</th>
                <th className="py-3 px-4 font-semibold">Name</th>
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
                  <tr key={room.id} className="hover:bg-gray-50 border-b">
                    <td className="py-3 px-4">{room.id.substring(0, 8)}...</td>
                    <td className="py-3 px-4">{room.name}</td>
                    <td className="py-3 px-4">{room.city}</td>
                    <td className="py-3 px-4">R{room.price_per_night?.toLocaleString() || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        room.is_active === false 
                          ? 'bg-gray-200 text-gray-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {room.is_active === false ? 'Inactive' : 'Available'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <FaEllipsisH
                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                        onClick={(e) => openMenu(e, room.id)}
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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Add/Edit Room Modal */}
        {modalOpen && (
          <AddRoomModal 
            onClose={handleModalClose} 
            accommodation={selectedAccommodation}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    </div>
  );
};

import { Button } from "./Button";
import logo from '../assets/logo.jpg'
import { useState } from "react";
import { adminService } from "../services/admin.service";

export const AddRoomModal = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    city: "Polokwane",
    description: "New room",
    address: "123 Main St", // Default for now
    country: "South Africa", // Default
    star_rating: 3,
    policies: {},
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await adminService.createAccommodation(formData);
      onClose();
      // Trigger refresh in parent if possible, or just close
      window.location.reload(); // Simple reload to show new data
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

      <div className="bg-white w-[500px] rounded-lg shadow-xl p-6 animate-fadeIn">
        <img src={logo} className="w-10" alt="" />

        <h1 className="text-2xl font-bold text-blue-500 mb-2">Add New Room</h1>
        <p className="text-gray-500 mb-6">
          Create a new accommodation.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div>
            <label className="font-semibold">Room Name / Type</label>
            <input 
              className="w-full border p-2 rounded mt-1" 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Deluxe Suite" 
              required
            />
          </div>

          <div>
            <label className="font-semibold">Location (City)</label>
            <select 
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="Polokwane">Polokwane</option>
              <option value="Pretoria">Pretoria</option>
              <option value="Cape Town">Cape Town</option>
              <option value="Mbombela">Mbombela</option>
              <option value="Giyani">Giyani</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Description</label>
            <textarea 
              className="w-full border p-2 rounded mt-1" 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Room description..." 
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
};

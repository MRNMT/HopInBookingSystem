import { Button } from "./Button";
import logo from '../assets/logo.jpg'
import { useState, useEffect } from "react";
import { adminService, type Accommodation } from "../services/admin.service";

interface AddRoomModalProps {
  onClose: () => void;
  accommodation?: Accommodation | null;
  onSuccess?: () => void;
}

export const AddRoomModal = ({ onClose, accommodation, onSuccess }: AddRoomModalProps) => {
  const isEditMode = !!accommodation;
  
  const [formData, setFormData] = useState({
    name: "",
    city: "Polokwane",
    description: "New room",
    address: "123 Main St",
    country: "South Africa",
    star_rating: 3,
    policies: {},
    images: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form with existing data when editing
  useEffect(() => {
    if (accommodation) {
      setFormData({
        name: accommodation.name || "",
        city: accommodation.city || "Polokwane",
        description: accommodation.description || "",
        address: accommodation.address || "123 Main St",
        country: accommodation.country || "South Africa",
        star_rating: 3,
        policies: {},
        images: accommodation.images || []
      });
    }
  }, [accommodation]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEditMode && accommodation) {
        // Update existing accommodation
        await adminService.updateAccommodation(accommodation.id, formData);
      } else {
        // Create new accommodation
        await adminService.createAccommodation(formData);
      }
      
      onSuccess?.(); // Call success callback if provided
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} accommodation`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

      <div className="bg-white w-full max-w-md sm:max-w-lg rounded-lg shadow-xl p-6 animate-fadeIn mx-4">
        <img src={logo} className="w-10" alt="" />

        <h1 className="text-2xl font-bold text-blue-500 mb-2">
          {isEditMode ? 'Edit Accommodation' : 'Add New Accommodation'}
        </h1>
        <p className="text-gray-500 mb-6">
          {isEditMode ? 'Update accommodation details.' : 'Create a new accommodation.'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div>
            <label className="font-semibold">Accommodation Name / Type</label>
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
              placeholder="Accommodation description..." 
              rows={3}
            />
          </div>

          <div>
            <label className="font-semibold">Address</label>
            <input 
              className="w-full border p-2 rounded mt-1" 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address" 
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update" : "Add")}
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
};

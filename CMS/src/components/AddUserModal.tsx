import { Button } from "./Button";
import { useState } from "react";
import { superAdminService } from "../services/superadmin.service";

interface AddUserModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddUserModal = ({ onClose, onSuccess }: AddUserModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await superAdminService.createAdmin(formData);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

      <div className="bg-white w-[500px] rounded-lg shadow-xl p-6 animate-fadeIn">

        <h1 className="text-2xl font-bold text-blue-500 mb-2">Add New Admin</h1>
        <p className="text-gray-500 mb-6">
          Create a new admin account.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label className="font-semibold block text-sm mb-1">Full Name</label>
            <input 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe" 
              required
            />
          </div>

          <div>
            <label className="font-semibold block text-sm mb-1">Email</label>
            <input 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@hopinAdmin.email" 
              required
            />
          </div>

          <div>
            <label className="font-semibold block text-sm mb-1">Password</label>
            <input 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********" 
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Add Admin"}
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
};



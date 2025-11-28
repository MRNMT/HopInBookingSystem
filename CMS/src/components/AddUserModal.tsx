import { Button } from "./Button";

export const AddUserModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

      <div className="bg-white w-[500px] rounded-lg shadow-xl p-6 animate-fadeIn">

        <h1 className="text-2xl font-bold text-blue-500 mb-2">Add New User</h1>
        <p className="text-gray-500 mb-6">
          Add a New User. Fill in all the details below.
        </p>

        <form className="space-y-4">

          <div>
            <label className="font-semibold">User Name</label>
            <input className="w-full border p-2 rounded mt-1" type="text" placeholder="e.g., R111" />
          </div>

          <div>
            <label className="font-semibold">User Role</label>
            <select  aria-label="role" className="w-full border p-2 rounded mt-1">
              <option>Admin</option>
              <option>Manager</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-semibold">Capacity</label>
              <input className="w-full border p-2 rounded mt-1" type="text" placeholder="Enter Capacity" />
            </div>

            <div className="flex-1">
              <label className="font-semibold">Price/Night</label>
              <input className="w-full border p-2 rounded mt-1" type="text" placeholder="Enter Price" />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary">Add</Button>
          </div>
        </form>
      </div>

    </div>
  );
};



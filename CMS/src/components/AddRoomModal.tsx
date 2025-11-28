import { Button } from "./Button";
import logo from '../assets/logo.jpg'

export const AddRoomModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

      <div className="bg-white w-[500px] rounded-lg shadow-xl p-6 animate-fadeIn">
        <img src={logo} className="w-10" alt="" />

        <h1 className="text-2xl font-bold text-blue-500 mb-2">Add New Room</h1>
        <p className="text-gray-500 mb-6">
          Create a new room in your hotel . Fill in all the details below.
        </p>

        <form className="space-y-4">
          <div>
            <label className="font-semibold">Room Picture</label>
            <input aria-label="room picture" className="w-full border p-2 rounded mt-1" type="file" />
          </div>

          <div>
            <label className="font-semibold">Room ID</label>
            <input className="w-full border p-2 rounded mt-1" type="text" placeholder="e.g., R111" />
          </div>

          <div>
            <label className="font-semibold">Room Type</label>
            <input className="w-full border p-2 rounded mt-1" type="text" placeholder="e.g., Deluxe Suite" />
          </div>

          <div>
            <label className="font-semibold">Room Location</label>
            <select aria-label="location"  className="w-full border p-2 rounded mt-1">
              <option>Polokwane</option>
              <option>Pretoria</option>
              <option>Cape Town</option>
              <option>Mbombela</option>
              <option>Giyani</option>
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

          <div>
            <label className="font-semibold">Status</label>
            <select aria-label="status"  id="status" className="w-full border p-2 rounded mt-1">
              <option>Available</option>
              <option>Occupied</option>
            </select>
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

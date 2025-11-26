import { SideBar } from "../components/SideBar";
import { Button } from "../components/Button";
import { FaEllipsis } from "react-icons/fa6";

export const Bookings = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-10 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-600 text-sm">Manage all hotel bookings.</p>
          </div>

          {/* New Booking Button */}
          <Button variant="primary">New Booking</Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search bookings..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-80 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-6 py-3">Booking ID</th>
                <th className="px-6 py-3">Guest Name</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Room Type</th>
                <th className="px-6 py-3">Check-in</th>
                <th className="px-6 py-3">Check-out</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="text-gray-800">
              {/* Row 1 */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">KK001</td>
                <td className="px-6 py-4">Karabo Ndima</td>
                <td className="px-6 py-4">Polokwane</td>
                <td className="px-6 py-4">Deluxe</td>
                <td className="px-6 py-4">2025-06-11</td>
                <td className="px-6 py-4">2025-06-20</td>
                <td className="px-6 py-4">R4000</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    Confirmed
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <FaEllipsis className="cursor-pointer" />
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">KK002</td>
                <td className="px-6 py-4">Musiki</td>
                <td className="px-6 py-4">Pretoria</td>
                <td className="px-6 py-4">Deluxe</td>
                <td className="px-6 py-4">2025-06-11</td>
                <td className="px-6 py-4">2025-06-20</td>
                <td className="px-6 py-4">R4000</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    Confirmed
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <FaEllipsis className="cursor-pointer" />
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">KK003</td>
                <td className="px-6 py-4">Nelson</td>
                <td className="px-6 py-4">Cape Town</td>
                <td className="px-6 py-4">Deluxe</td>
                <td className="px-6 py-4">2025-06-11</td>
                <td className="px-6 py-4">2025-06-20</td>
                <td className="px-6 py-4">R4000</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <FaEllipsis className="cursor-pointer" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

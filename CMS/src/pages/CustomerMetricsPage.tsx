import { SideBar } from "../components/SideBar";
import { FaSearch } from "react-icons/fa";
import { FaEllipsisH } from "react-icons/fa";

export const CustomerMetricsPage = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SideBar />

      <div className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <span className="text-gray-500">Manage Customer information and security</span>

        {/* Metrics Section */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-gray-700">Total Customers</h2>
            <span className="text-3xl font-bold text-gray-900">1,142</span><br />
            <span className="text-green-500 text-sm">↑ 12% from last month</span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-gray-700">Active This Month</h2>
            <span className="text-3xl font-bold text-gray-900">248</span><br />
            <span className="text-green-500 text-sm">↑ 12% from last month</span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-gray-700">Avg Bookings</h2>
            <span className="text-3xl font-bold text-gray-900">5.2</span><br />
            <span className="text-green-500 text-sm">Per Person</span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-gray-700">Lifetime Value</h2>
            <span className="text-3xl font-bold text-gray-900">R5,200</span><br />
            <span className="text-green-500 text-sm">↑ 12% from last month</span>
          </div>
        </div>

        {/* Search + Table */}
        <div className="bg-white p-6 rounded-2xl shadow mt-10">
          <div className="flex items-center gap-3 mb-4 border p-3 rounded-lg">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search Customers"
              className="outline-none flex-1"
            />
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">Customer ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Location</th>
                <th className="p-3">Bookings</th>
                <th className="p-3">Total Spent</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">C001</td>
                <td className="p-3">Karabo</td>
                <td className="p-3">karabo@example.com</td>
                <td className="p-3">New York</td>
                <td className="p-3">15</td>
                <td className="p-3">R1,200</td>
                <td className="p-3 text-green-600 font-semibold">Occupied</td>
                <td className="p-3"><FaEllipsisH className="text-blue-500 cursor-pointer" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

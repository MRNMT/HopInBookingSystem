import { SideBar } from "../components/SideBar";
import { FaSearch } from "react-icons/fa";
import { FaEllipsisH } from "react-icons/fa";
import { useEffect, useState } from "react";
import { adminService, type User } from "../services/admin.service";

export const CustomerMetricsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminService.getAllUsers();
        setUsers(response.data || response);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <span className="text-3xl font-bold text-gray-900">{users.length}</span><br />
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none flex-1"
            />
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">Customer ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">Loading customers...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">No customers found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.id.substring(0, 8)}...</td>
                    <td className="p-3">{user.full_name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="p-3"><FaEllipsisH className="text-blue-500 cursor-pointer" /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

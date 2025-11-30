import { SideBar } from "../components/SideBar";
import { FaSearch } from "react-icons/fa";
import { FaEllipsisH } from "react-icons/fa";
import { useEffect, useState } from "react";
import { adminService, type User } from "../services/admin.service";

export const CustomerMetricsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    activeThisMonth: 0,
    totalBookings: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [usersResponse, statsResponse] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getDashboardStats()
        ]);
        
        setUsers(usersResponse);
        
        // Calculate metrics
        const customers = usersResponse.filter(u => u.role === 'customer');
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const activeThisMonth = customers.filter(user => {
          const createdAt = new Date(user.created_at);
          return createdAt >= firstDayOfMonth;
        }).length;

        setMetrics({
          totalCustomers: customers.length,
          activeThisMonth: activeThisMonth,
          totalBookings: statsResponse.totalBookings || 0
        });
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

  // Calculate average bookings per customer
  const avgBookingsPerCustomer = metrics.totalCustomers > 0 
    ? (metrics.totalBookings / metrics.totalCustomers).toFixed(1)
    : '0.0';

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SideBar />

      <div className="flex-1 p-4 sm:p-6 md:p-8 ml-0 lg:ml-64">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Customers</h1>
        <span className="text-gray-500 text-sm">Manage Customer information and security</span>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">Total Customers</h2>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{metrics.totalCustomers}</span><br />
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">Active This Month</h2>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{metrics.activeThisMonth}</span><br />
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">Avg Bookings</h2>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{avgBookingsPerCustomer}</span><br />
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">Total Bookings</h2>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{metrics.totalBookings}</span><br />
          </div>
        </div>

        {/* Search + Table */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow mt-6 sm:mt-10">
          <div className="flex items-center gap-3 mb-4 border p-3 rounded-lg">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search Customers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none flex-1 text-sm"
            />
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 min-w-[140px]">Name</th>
                  <th className="p-3 min-w-[180px]">Contact</th>
                  <th className="p-3 min-w-[100px]">Role</th>
                  <th className="p-3 min-w-[120px]">Joined</th>
                  <th className="p-3 min-w-[80px]">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">Loading customers...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">No customers found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading customers...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No customers found.</div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  {/* Header with Name and Action */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                    </div>
                    <FaEllipsisH className="text-blue-500 cursor-pointer text-lg" />
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Contact:</span>
                      <span className="text-sm font-medium truncate ml-2">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Role:</span>
                      <span className="text-sm font-medium capitalize">{user.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Joined:</span>
                      <span className="text-sm font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
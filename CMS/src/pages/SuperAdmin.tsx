import { SideBar } from "../components/SideBar";
import { FiUsers } from "react-icons/fi";
import { RiVipCrownLine } from "react-icons/ri";
import { IoShieldOutline } from "react-icons/io5";
import { GoPersonAdd } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { FaEllipsisH } from "react-icons/fa";
import { Button } from "../components/Button";

export const SuperAdmin = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 p-10 ml-64">
        
        {/* Header (FIXED — left + right) */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-500">Manage admin users, roles, and permissions</p>
          </div>

          <Button variant="primary" className="gap-2 flex items-center">
            <GoPersonAdd size={18} />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-md p-6 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="text-gray-600">Total Users</h3>
              <p className="text-3xl font-bold">24</p>
            </div>
            <FiUsers size={35} className="text-blue-500" />
          </div>

          <div className="bg-white shadow-md p-6 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="text-gray-600">Super Admins</h3>
              <p className="text-3xl font-bold">3</p>
            </div>
            <RiVipCrownLine size={35} className="text-blue-500" />
          </div>

          <div className="bg-white shadow-md p-6 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="text-gray-600">Active Today</h3>
              <p className="text-3xl font-bold">18</p>
            </div>
            <IoShieldOutline size={35} className="text-blue-500" />
          </div>

          <div className="bg-white shadow-md p-6 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="text-gray-600">Pending Invites</h3>
              <p className="text-3xl font-bold">2</p>
            </div>
            <GoPersonAdd size={35} className="text-blue-500" />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-6 w-full md:w-1/3">
          <CiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Karabo",
                  role: "Super Admin",
                  location: "All Locations",
                  status: "Active",
                  last: "2025-01-11",
                },
                {
                  name: "Sara",
                  role: "Admin",
                  location: "Polokwane",
                  status: "Active",
                  last: "2025-01-11",
                },
                {
                  name: "Thabo",
                  role: "Admin",
                  location: "Free State",
                  status: "Active",
                  last: "2025-01-11",
                },
              ].map((user, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">{user.location}</td>
                  <td className="p-4 text-blue-500 font-semibold">
                    {user.status}
                  </td>
                  <td className="p-4">{user.last}</td>
                  <td className="p-4 text-right">
                    <FaEllipsisH className="text-blue-500 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

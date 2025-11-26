import { SideBar } from "../components/SideBar";
import { TbPigMoney } from "react-icons/tb";
import { GoPeople } from "react-icons/go";
import { BsFileBarGraph, BsGraphUpArrow } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

export const Analytics = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1">
        <SideBar />

        {/* Main Content */}
        <div className="flex-1 p-10 overflow-auto ml-64">
          {/* Header */}
          <h1 className="text-4xl font-bold text-gray-900 mb-1">Analytics</h1>
          <p className="text-gray-600 text-sm mb-10">Track performance across all HopIn locations</p>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            {[ 
              { title: "Total Revenue", value: "R25,000", icon: TbPigMoney },
              { title: "Booking Growth", value: "R25,000", icon: BsFileBarGraph },
              { title: "Monthly Increase", value: "R25,000", icon: BsGraphUpArrow },
              { title: "Total Customers", value: "R25,000", icon: GoPeople },
            ].map((item, i) => (
              <div key={i} className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition">
                <h2 className="text-gray-700 font-semibold text-lg">{item.title}</h2>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-3xl font-bold text-gray-900">{item.value}</span>
                  <item.icon className="text-blue-500 text-3xl" />
                </div>
                <span className="text-green-600 text-sm mt-2 block">↑ 12.5% from last month</span>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow p-6 h-72">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue Trend (Last 6 Months)</h2>
              <div className="w-full h-full flex items-center justify-center text-gray-400"><LineChart width={450} height={200} data={[{month:"Jan", revenue:4000},{month:"Feb", revenue:5000},{month:"Mar", revenue:4800},{month:"Apr", revenue:5200},{month:"May", revenue:6100},{month:"Jun", revenue:7000}]}> <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} /> <XAxis dataKey="month" /> <YAxis /> <Tooltip /> </LineChart></div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 h-72">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Bookings by Location</h2>
              <div className="w-full h-full flex items-center justify-center text-gray-400"><BarChart width={450} height={200} data={[{location:"Gauteng", bookings:245},{location:"Limpopo", bookings:180},{location:"KZN", bookings:210},{location:"Cape Town", bookings:160}]}> <Bar dataKey="bookings" stroke="#3b82f6" fill="#3b82f6" /> <XAxis dataKey="location" /> <YAxis /> <Tooltip /> </BarChart></div>
            </div>
          </div>

          {/* Location Performance */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Location Performance</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <FaLocationDot className="text-blue-500 text-2xl" />
                <div>
                  <h3 className="font-semibold text-gray-900">Gauteng</h3>
                  <span className="text-gray-600 text-sm">245 bookings</span>
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-gray-900">R125,000</h3>
                <span className="text-gray-600 text-sm">Total Revenue</span>
              </div>
            </div>
          </div>
          

        </div>
      </div>
    </div>
  );
};

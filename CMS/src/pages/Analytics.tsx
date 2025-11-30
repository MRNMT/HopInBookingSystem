import { SideBar } from "../components/SideBar";
import { TbPigMoney } from "react-icons/tb";
import { GoPeople } from "react-icons/go";
import { BsFileBarGraph, BsGraphUpArrow } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { useEffect, useState } from "react";
import { adminService } from "../services/admin.service";

export const Analytics = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalGuests: 0,
    occupancyRate: 0
  });
  const [locationData, setLocationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dashboardStats, locationPerformance] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getLocationPerformance()
        ]);

        setStats({
          totalRevenue: dashboardStats.revenue || 0,
          totalBookings: dashboardStats.totalBookings || 0,
          totalGuests: dashboardStats.totalGuests || 0,
          occupancyRate: dashboardStats.occupancyRate || 0
        });

        setLocationData(locationPerformance || []);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatCurrency = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const barChartData = locationData.map(loc => ({
    location: loc.city,
    bookings: parseInt(loc.confirmed_bookings) || 0
  }));

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1">
        <SideBar />

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-auto lg:ml-64">
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">Analytics</h1>
          <p className="text-gray-600 text-sm mb-6 sm:mb-8 lg:mb-10">Track performance across all HopIn locations</p>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Loading analytics...</div>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
                {[ 
                  { title: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: TbPigMoney },
                  { title: "Total Bookings", value: stats.totalBookings.toString(), icon: BsFileBarGraph },
                  { title: "Occupancy Rate", value: `${stats.occupancyRate}%`, icon: BsGraphUpArrow },
                  { title: "Total Guests", value: stats.totalGuests.toString(), icon: GoPeople },
                ].map((item, i) => (
                  <div key={i} className="bg-white shadow rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition">
                    <h2 className="text-gray-700 font-semibold text-base sm:text-lg">{item.title}</h2>
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">{item.value}</span>
                      <item.icon className="text-blue-500 text-2xl sm:text-3xl" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="bg-white rounded-2xl shadow p-4 sm:p-5 lg:p-6 h-64 sm:h-72">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Bookings by Location</h2>
                  <div className="w-full h-full flex items-center justify-center">
                    {barChartData.length > 0 ? (
                      <BarChart 
                        width={window.innerWidth < 640 ? 300 : window.innerWidth < 1024 ? 400 : 450} 
                        height={window.innerWidth < 640 ? 150 : 200} 
                        data={barChartData}
                      >
                        <Bar dataKey="bookings" stroke="#3b82f6" fill="#3b82f6" />
                        <XAxis dataKey="location" />
                        <YAxis />
                        <Tooltip />
                      </BarChart>
                    ) : (
                      <p className="text-gray-400">No booking data available</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-4 sm:p-5 lg:p-6 h-64 sm:h-72">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Revenue Distribution</h2>
                  <div className="w-full h-full flex items-center justify-center">
                    {locationData.length > 0 ? (
                      <BarChart 
                        width={window.innerWidth < 640 ? 300 : window.innerWidth < 1024 ? 400 : 450} 
                        height={window.innerWidth < 640 ? 150 : 200} 
                        data={locationData.map(loc => ({
                          location: loc.city,
                          revenue: parseFloat(loc.total_revenue) || 0
                        }))}
                      >
                        <Bar dataKey="revenue" stroke="#10b981" fill="#10b981" />
                        <XAxis dataKey="location" />
                        <YAxis />
                        <Tooltip />
                      </BarChart>
                    ) : (
                      <p className="text-gray-400">No revenue data available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Performance */}
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Location Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {locationData.length > 0 ? (
                  locationData.map((location, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <FaLocationDot className="text-blue-500 text-xl sm:text-2xl" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{location.city}</h3>
                          <span className="text-gray-600 text-sm">{location.confirmed_bookings} bookings</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <h3 className="font-bold text-gray-900">{formatCurrency(parseFloat(location.total_revenue) || 0)}</h3>
                        <span className="text-gray-600 text-sm">Total Revenue</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-600">
                    No location performance data available
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
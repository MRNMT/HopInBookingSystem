import { FaLocationDot, FaBed } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { TbPigMoney } from "react-icons/tb";
import { type FC, useEffect, useState } from 'react';
import { type IconType } from 'react-icons';
import { SideBar } from "../components/SideBar";
import { adminService } from "../services/admin.service";

interface StatCardProps {
    title: string;
    value: string;
    icon: IconType;
    change: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon: Icon, change }) => (
    <div className='bg-white rounded-2xl shadow-md p-4 sm:p-6 flex-1 transition hover:shadow-lg'>
        <div className='flex items-center justify-between mb-3'>
            <span className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800'>{value}</span>
            <Icon className='text-blue-500 text-2xl sm:text-3xl' />
        </div>
        <span className='block text-gray-700 text-xs sm:text-sm font-semibold'>{title}</span>
        <span className='text-green-600 text-xs font-medium mt-1'>↑ {change} from last month</span>
    </div>
)

export const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [locationData, setLocationData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setError(null);
                const [dashboardStats, locationPerformance] = await Promise.all([
                    adminService.getDashboardStats(),
                    adminService.getLocationPerformance()
                ]);
                
                console.log('Dashboard stats:', dashboardStats);
                console.log('Location performance:', locationPerformance);
                
                setStats(dashboardStats);
                setLocationData(locationPerformance || []);
            } catch (error: any) {
                console.error("Failed to fetch dashboard stats", error);
                setError(error.response?.data?.message || "Failed to load dashboard stats. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (amount: number) => {
        return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    if (loading) {
        return (
            <div className='flex h-screen bg-gray-100'>
                <SideBar />
                <div className='flex-1 p-10 ml-64 flex items-center justify-center'>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex h-screen bg-gray-100'>

            <SideBar />

            <div className='flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-auto ml-0 lg:ml-64'>
                {/* Header */}
                <div className='mb-10'>
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1'>Dashboard</h1>
                    <p className='text-gray-600 text-sm'>Welcome back! Here's what's happening today.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Stats */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10'>
                    <StatCard title="Total Bookings" value={stats?.totalBookings?.toString() || "0"} icon={MdOutlineDateRange} change="8%" />
                    <StatCard title="Revenue" value={`R${stats?.revenue?.toLocaleString() || "0"}`} icon={TbPigMoney} change="8%" />
                    <StatCard title="Occupancy Rate" value={`${stats?.occupancyRate || 0}%`} icon={FaBed} change="3%" />
                    <StatCard title="Total Guests" value={stats?.totalGuests?.toString() || "0"} icon={GoPeople} change="15%" />
                </div>

                {/* Charts + Lists */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>

                    {/* Performance by Location */}
                    <div className='bg-white rounded-2xl shadow-md p-6'>
                        <h2 className='text-xl font-bold mb-5 text-gray-800'>Performance by Location</h2>
                        <div className='space-y-4'>
                            {locationData.length > 0 ? (
                                locationData.map((location, i) => (
                                    <div key={i} className='flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition'>
                                        <div className='flex items-center gap-3'>
                                            <FaLocationDot className='text-red-500 text-xl' />
                                            <div>
                                                <h3 className='font-semibold text-gray-800'>{location.city}</h3>
                                                <span className='text-sm text-gray-600'>{location.confirmed_bookings} Bookings</span>
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <p className='font-bold text-blue-500 text-lg'>{formatCurrency(parseFloat(location.total_revenue) || 0)}</p>
                                            <span className='text-sm text-gray-600'>Revenue</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No location data available</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Bookings */}
                    <div className='bg-white rounded-2xl shadow-md p-6'>
                        <h2 className='text-xl font-bold mb-5 text-gray-800'>Recent Bookings</h2>
                        <div className='space-y-4'>
                            {/* Header Row */}
                            <div className='grid grid-cols-4 gap-4 pb-3 border-b font-semibold text-sm text-gray-700'>
                                <div>Guest</div>
                                <div>Location</div>
                                <div>Check In</div>
                                <div>Status</div>
                            </div>

                            {/* Booking Row */}
                            {stats?.recentBookings?.length > 0 ? (
                                stats.recentBookings.map((booking: any) => (
                                    <div key={booking.id} className='grid grid-cols-4 gap-4 p-3 rounded-xl hover:bg-gray-50 transition'>
                                        <div>
                                            <h3 className='font-semibold text-gray-900'>{booking.user?.full_name || 'Guest'}</h3>
                                            <span className='text-sm text-gray-600'>{booking.accommodation?.name || 'Room'}</span>
                                        </div>
                                        <div className='text-sm text-gray-700'>{booking.accommodation?.city || 'Location'}</div>
                                        <div className='text-sm font-semibold text-gray-900'>{new Date(booking.check_in_date).toLocaleDateString()}</div>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                booking.status === 'confirmed' ? 'bg-blue-500 text-white' :
                                                booking.status === 'pending' ? 'bg-yellow-500 text-white' :
                                                'bg-gray-500 text-white'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No recent bookings</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

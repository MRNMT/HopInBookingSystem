import { FaLocationDot, FaBed } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { TbPigMoney } from "react-icons/tb";
import { type FC } from 'react';
import { type IconType } from 'react-icons';
import { SideBar } from "../components/SideBar";

interface StatCardProps {
    title: string;
    value: string;
    icon: IconType;
    change: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon: Icon, change }) => (
    <div className='bg-white rounded-2xl shadow-md p-6 flex-1 transition hover:shadow-lg'>
        <div className='flex items-center justify-between mb-3'>
            <span className='text-4xl font-bold text-gray-800'>{value}</span>
            <Icon className='text-blue-500 text-3xl' />
        </div>
        <span className='block text-gray-700 text-sm font-semibold'>{title}</span>
        <span className='text-green-600 text-xs font-medium mt-1'>↑ {change} from last month</span>
    </div>
)

export const AdminDashboard = () => {
    return (
        <div className='flex h-screen bg-gray-100'>

            <SideBar />

            <div className='flex-1 p-10 overflow-auto ml-64'>
                {/* Header */}
                <div className='mb-10'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-1'>Dashboard</h1>
                    <p className='text-gray-600 text-sm'>Welcome back! Here's what's happening today.</p>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-4 gap-6 mb-10'>
                    <StatCard title="Total Bookings" value="650" icon={MdOutlineDateRange} change="8%" />
                    <StatCard title="Revenue" value="R5,000" icon={TbPigMoney} change="8%" />
                    <StatCard title="Occupancy Rate" value="87%" icon={FaBed} change="3%" />
                    <StatCard title="Total Guests" value="1,432" icon={GoPeople} change="15%" />
                </div>

                {/* Charts + Lists */}
                <div className='grid grid-cols-2 gap-6'>

                    {/* Performance by Location */}
                    <div className='bg-white rounded-2xl shadow-md p-6'>
                        <h2 className='text-xl font-bold mb-5 text-gray-800'>Performance by Location</h2>
                        <div className='space-y-4'>
                            {[{ city: 'Gauteng', bookings: 52, occupancy: 92 }].map((item, i) => (
                                <div key={i} className='flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition'>
                                    <div className='flex items-center gap-3'>
                                        <FaLocationDot className='text-red-500 text-xl' />
                                        <div>
                                            <h3 className='font-semibold text-gray-800'>{item.city}</h3>
                                            <span className='text-sm text-gray-600'>{item.bookings} Bookings</span>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='font-bold text-blue-500 text-lg'>{item.occupancy}%</p>
                                        <span className='text-sm text-gray-600'>Occupancy</span>
                                    </div>
                                </div>
                            ))}
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
                            <div className='grid grid-cols-4 gap-4 p-3 rounded-xl hover:bg-gray-50 transition'>
                                <div>
                                    <h3 className='font-semibold text-gray-900'>John Smith</h3>
                                    <span className='text-sm text-gray-600'>Deluxe Suite</span>
                                </div>
                                <div className='text-sm text-gray-700'>Limpopo, Polokwane</div>
                                <div className='text-sm font-semibold text-gray-900'>2025-11-24</div>
                                <div>
                                    <span className='bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold'>Confirmed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

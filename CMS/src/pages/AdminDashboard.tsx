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
    <div className='bg-white rounded-lg shadow p-6 flex-1'>
        <div className='flex items-center justify-between mb-2'>
            <span className='text-3xl font-bold'>{value}</span>
            <Icon className='text-blue-500 text-2xl' />
        </div>
        <span className='block text-gray-700 text-sm font-semibold mb-1'>{title}</span>
        <span className='text-green-600 text-sm font-medium'>↑ {change} from last month</span>
    </div>
)




export const AdminDashboard = () => {
    return (
        <div className='flex h-screen bg-gray-100'>
            
            <SideBar />
            {/* Main Content */}
            <div className='flex-1 p-8 overflow-auto'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold mb-2 mt-10'>Dashboard</h1>
                    <p className='text-gray-600'>Welcome back! Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-4 gap-6 mb-8'>
                    <StatCard title="Total Bookings" value="650" icon={MdOutlineDateRange} change="8%" />
                    <StatCard title="Revenue" value="R5,000" icon={TbPigMoney} change="8%" />
                    <StatCard title="Occupancy Rate" value="87%" icon={FaBed} change="3%" />
                    <StatCard title="Total Guests" value="1,432" icon={GoPeople} change="15%" />
                </div>

                {/* Charts Section */}
                <div className='grid grid-cols-2 gap-6'>
                    {/* Performance by Location */}
                    <div className='bg-white rounded-lg shadow p-6'>
                        <h2 className='text-xl font-bold mb-4'>Performance by Location</h2>
                        <div className='space-y-3'>
                            {[{ city: 'Gauteng', bookings: 52, occupancy: 92 }].map((item, i) => (
                                <div key={i} className='flex items-center justify-between p-3 border rounded hover:bg-gray-50'>
                                    <div className='flex items-center gap-3'>
                                        <FaLocationDot className='text-red-500' />
                                        <div>
                                            <h3 className='font-semibold'>{item.city}</h3>
                                            <span className='text-sm text-gray-600'>{item.bookings} Bookings</span>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='font-bold text-blue-500'>{item.occupancy}%</p>
                                        <span className='text-sm text-gray-600'>Occupancy</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Bookings */}
                    <div className='bg-white rounded-lg shadow p-6'>
                        <h2 className='text-xl font-bold mb-4'>Recent Bookings</h2>
                        <div className='space-y-3'>
                            <div className='grid grid-cols-4 gap-4 pb-3 border-b font-semibold text-sm'>
                                <div>Guest</div>
                                <div>Location</div>
                                <div>Check In</div>
                                <div>Status</div>
                            </div>
                            <div className='grid grid-cols-4 gap-4 p-3 hover:bg-gray-50 rounded'>
                                <div>
                                    <h3 className='font-semibold'>John Smith</h3>
                                    <span className='text-sm text-gray-600'>Deluxe Suite</span>
                                </div>
                                <div className='text-sm'>Limpopo, Polokwane</div>
                                <div className='text-sm font-semibold'>2025-11-24</div>
                                <div>
                                    <span className='bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold'>Confirmed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

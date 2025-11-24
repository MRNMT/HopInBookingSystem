import { FaHotel, FaBed } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { IoPricetagOutline } from "react-icons/io5";
import { VscGraph } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";
import { TbPigMoney } from "react-icons/tb";
import logo from '../assets/logo2.png';
import { type FC } from 'react';
import { type IconType } from 'react-icons';

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

interface SidebarItemProps {
    icon: IconType;
    label: string;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon: Icon, label }) => (
    <div className='flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-blue-50 transition'>
        <Icon className='text-lg' />
        <span>{label}</span>
    </div>
)


export const AdminDashboard = () => {
    return (
        <div className='flex h-screen bg-gray-100'>
            {/* Sidebar */}
            <div className='w-64 bg-white shadow-lg p-6'>
                <div className='flex items-center gap-3 mb-8'>
                    <FaHotel className='text-blue-500 text-2xl' />
                    <img src={logo} alt="Logo" className='w-16' />
                </div>
                <h1 className='text-lg font-bold mb-6'>Admin Panel</h1>
                
                <nav className='space-y-1'>
                    <div className='bg-blue-500 text-white rounded p-3 font-semibold'>Dashboard</div>
                    <SidebarItem icon={MdOutlineDateRange} label="Bookings" />
                    <SidebarItem icon={FaBed} label="Rooms" />
                    <SidebarItem icon={GoPeople} label="Customers" />
                    <SidebarItem icon={IoPricetagOutline} label="Deals" />
                    <SidebarItem icon={VscGraph} label="Analytics" />
                    <SidebarItem icon={CiSettings} label="Settings" />
                </nav>
            </div>

            {/* Main Content */}
            <div className='flex-1 p-8 overflow-auto'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold mb-2'>Dashboard</h1>
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

import { FaHotel, FaBed } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { IoPricetagOutline } from "react-icons/io5";
import { VscGraph } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";
import logo from '../assets/logo2.png';
import { type FC } from 'react';
import { type IconType } from 'react-icons';

// interface StatCardProps {
//     title: string;
//     value: string;
//     icon: IconType;
//     change: string;
// }


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

export const SideBar: FC = () => {
  return (
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
  );
};

import React from 'react'
import { FaHotel } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { IoPricetagOutline } from "react-icons/io5";
import { VscGraph } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";
import logo from '../assets/logo2.png';
import { TbPigMoney } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";

export const AdminDashboard = () => {
  return (
    <div className='flex gap-20 p-5'>
        <div>
            <div className='flex'>
                <FaHotel/>
                <div>
                <img src={logo} alt="Logo" className='w-20' />
                <h1>Admin Panel</h1>
                </div>
            </div>
          
                <div className='flex'><MdOutlineDateRange/> Bookings</div>
                <div className='flex'><FaBed />Rooms</div>
                <div className='flex'><GoPeople />Customers</div>
                <div className='flex'><IoPricetagOutline />Deals</div>
                <div className='flex'><VscGraph />Analytics</div>
                <div className='flex'><CiSettings />Settings</div>
               
            
        </div>
        <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>
            
            <div className='flex gap-24 mt-10'>
            <div>
                <h2>Total Bookings</h2>
                <div className='flex gap-7'>
                    <span>650</span>
                    < MdOutlineDateRange/>
                </div>
                <span>+ 8% from last month</span>
            </div>
            <div className=''>
                <h2>Revenue</h2>
                <div className='flex gap-7'>
                    <span>R5000</span>
                    <TbPigMoney />
                </div>
                <span>+ 8% from last month</span>
            </div>
            
            <div>
                <h2>Occupancy Rate</h2>
                <div className='flex gap-7'>
                    <span>87%</span>
                    <FaBed />
                </div>
                <span>+ 3% from last month</span>

            </div>
            <div>
                <h2>Total Guests</h2>
                <div className='flex gap-7'>
                    <span>1,432</span>
                    <GoPeople />
                </div>
                <span>+ 15% from last month</span>
            </div>
            </div>
             <div className='flex justify-between'>
            <div>
                <h1>Performance by Location</h1>
                  <div className='flex justify-between'>
                    <div>
                        <FaLocationDot />
                    </div>
                    <div>
                        <h2>Gauteng</h2>
                        <span>52 Bookings</span>
                    </div>
                    <div>
                        <h2>
                            92%
                        </h2>
                        <span>
                            Occupancy
                        </span>
                        
                    </div>
                </div>
            </div>
            <div>
                <h1>Recent Bookings</h1>
                <div className='flex justify-between gap-5'>
                    <div>Guest</div>
                    <div>Location</div>
                    <div>Check In</div>
                    <div>Status</div>
                </div>
                <div className='flex justify-between gap-5'>
                    <div>
                        <h2>John Smith</h2>
                        <span>Deluxe Suite</span>
                    </div>
                    <div>
                        <h2>Limpopo, Polokwane</h2>
                    </div>
                    <div>
                        <h2>2025-11-24</h2>
                    </div>
                    <div>
                        <span className=''>Confirmed</span>
                    </div>
                </div>
               
            </div>
        </div>
    </div>
       
    </div>
  )
}




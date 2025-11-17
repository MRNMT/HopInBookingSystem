import { FaArrowRight } from "react-icons/fa";
import hotel from '../assets/hotel_bg.jpeg'
import { FaLocationDot } from "react-icons/fa6";
import { FaWifi } from "react-icons/fa";
import { FaPlateWheat } from "react-icons/fa6";
import { Button } from "../components/Button";




export const FeaturedHotels = () => {
  return (
    <div>
        <div>
            <h1>Featured Hotels</h1>
            {/* Link feature coming soon */}
            <p>View All <FaArrowRight />
</p>
        </div>
        <p>Hand-picked luxury accomodationds for you</p>
        <div>
            <div>
                <img src={hotel} alt="" />
                <h1>Grand Luxury Hotel</h1>
                <span><FaLocationDot />New York, USA</span>
                <span>5 678 reviews</span>
                <FaWifi/><FaPlateWheat/>
                <hr />
                <Button variant="primary">Book Now</Button>



            </div>
            <div>
                <img src={hotel} alt="" />
                <h1>Ocean View Resort</h1>
                <span><FaLocationDot />Miami, USA</span>
                <span>5 678 reviews</span>
                <FaWifi/><FaPlateWheat/>
                <hr />
                <Button variant="primary">Book Now</Button>
            </div>
            <div>
                <img src={hotel} alt="" />
                <h1>Metropolitian Suites</h1>
                <span><FaLocationDot />Los Angeles, USA</span>
                <span>5 678 reviews</span>
                <FaWifi/><FaPlateWheat/>
                <hr />
                <Button variant="primary">Book Now</Button>
            </div>
        </div>
    </div>
  )
}

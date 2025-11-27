import hotelBackground from "../assets/hotel_bg.jpg";
import { Button } from "../components/Button";

// import styles from '../App.css'
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <>
      {/* HERO SECTION */}
      <div
        className="h-screen w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${hotelBackground})` }}
      >
        <div className="max-w-xl px-10 md:px-20">
          <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">
            Find Your Perfect Stay
          </h1>

          <p className="text-white text-lg md:text-xl mt-4 opacity-90">
            Discover luxury hotels and resorts at the best prices
          </p>

          <div className="flex gap-4 mt-8">
            <Link to="/find">
              <Button variant="primary">View Rooms</Button>
            </Link>
            <Button variant="secondary">Learn More</Button>
          </div>
        </div>
      </div>

    </>
  );
};

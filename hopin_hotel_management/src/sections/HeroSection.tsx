import hotelBackground from "../assets/hotel_bg.jpeg";
import { Button } from "../components/Button";

export const HeroSection = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${hotelBackground})` }}
    >
      <div className="max-w-xl px-10 md:px-20">

        {/* Title */}
        <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">
          Find Your Perfect Stay
        </h1>

        {/* Subtitle */}
        <p className="text-white text-lg md:text-xl mt-4 opacity-90">
          Discover luxury hotels and resorts at the best prices
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <Button variant="primary">Explore Hotels</Button>
          <Button variant="outline">Learn More</Button>
        </div>

      </div>
      <div className="bg-amber-400">
        <div className="bg-amber-50">Where are you going?</div>
        <div className="bg-amber-50">Check-in date - Checkout date</div>
        <div className="bg-amber-50">2 adult-0 children - 1 room</div>
        <div><Button variant="primary">Search here</Button></div>
      </div>
    </div>
  );
};

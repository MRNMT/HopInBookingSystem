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
    </div>
  );
};

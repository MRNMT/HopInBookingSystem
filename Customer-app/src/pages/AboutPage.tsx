import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Shield, Clock, CreditCard, MapPin, Users, Award, HeadphonesIcon, Smartphone } from "lucide-react";
import { useState } from "react";

export const AboutPage = () => {
  const [activeSection, setActiveSection] = useState("mission");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(sectionId);
    }
  };
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-5xl font-bold mb-4">About HopIn</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Your trusted partner for seamless accommodation booking across South Africa
            </p>
          </div>
        </div>

        {/* Sticky Navigation Menu */}
        <div className="sticky top-0 z-30 bg-white shadow-md border-b">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex overflow-x-auto py-4 gap-6">
              <button
                onClick={() => scrollToSection("mission")}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === "mission"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                Our Mission
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === "features"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === "how-it-works"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("system-info")}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === "system-info"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                System Info
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          
          {/* Mission Statement */}
          <section id="mission" className="mb-16 scroll-mt-32">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              HopIn is dedicated to revolutionizing the way South Africans discover and book accommodations. 
              We connect travelers with quality stays while providing property owners with a powerful platform 
              to showcase their offerings. Our mission is to make every booking experience smooth, secure, and satisfying.
            </p>
          </section>

          {/* Key Features */}
          <section id="features" className="mb-16 scroll-mt-32">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Choose HopIn?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
                <p className="text-gray-600">
                  All transactions are processed through Stripe, ensuring bank-level security for your payments.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Confirmation</h3>
                <p className="text-gray-600">
                  Receive immediate booking confirmations and detailed receipts via our notification system.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Wide Selection</h3>
                <p className="text-gray-600">
                  Browse accommodations across South Africa, from budget-friendly to luxury stays.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Flexible Payments</h3>
                <p className="text-gray-600">
                  Pay securely with credit/debit cards. All major cards accepted via Stripe.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">User Profiles</h3>
                <p className="text-gray-600">
                  Manage your bookings, view history, and track your reservations all in one place.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Verified Properties</h3>
                <p className="text-gray-600">
                  All accommodations are verified to ensure quality and authenticity.
                </p>
              </div>

            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="mb-16 bg-blue-50 rounded-2xl p-8 scroll-mt-32">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">Search</h3>
                <p className="text-gray-600 text-sm">
                  Browse accommodations by location, dates, and preferences
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">Select</h3>
                <p className="text-gray-600 text-sm">
                  Choose your room type and review all details
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">Book</h3>
                <p className="text-gray-600 text-sm">
                  Complete secure payment via Stripe
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  4
                </div>
                <h3 className="font-semibold text-lg mb-2">Enjoy</h3>
                <p className="text-gray-600 text-sm">
                  Receive confirmation and enjoy your stay
                </p>
              </div>

            </div>
          </section>

          {/* System Information */}
          <section id="system-info" className="mb-16 scroll-mt-32">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">System Information</h2>
            
            <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
              
              <div className="border-b pb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  Platform Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <span className="font-medium">Version:</span> 1.0.0
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> November 2025
                  </div>
                  <div>
                    <span className="font-medium">Platform:</span> Web Application
                  </div>
                  <div>
                    <span className="font-medium">Currency:</span> South African Rand (ZAR)
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Processing
                </h3>
                <p className="text-gray-600 mb-3">
                  All payments are securely processed through <strong>Stripe</strong>, a PCI-DSS compliant payment processor. 
                  We never store your card details on our servers.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>256-bit SSL encryption for all transactions</li>
                  <li>Real-time payment confirmation</li>
                  <li>Automatic receipt generation</li>
                  <li>Secure payment intent creation</li>
                </ul>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Security & Privacy
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>JWT-based authentication for secure user sessions</li>
                  <li>Password encryption using industry-standard bcrypt</li>
                  <li>HTTPS encryption for all data transmission</li>
                  <li>Regular security audits and updates</li>
                  <li>GDPR-compliant data handling</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <HeadphonesIcon className="w-5 h-5 text-blue-600" />
                  Support & Contact
                </h3>
                <p className="text-gray-600 mb-3">
                  Our support team is here to help you with any questions or issues.
                </p>
                <div className="space-y-2 text-gray-600">
                  <div>
                    <span className="font-medium">Email:</span> support@hopin.co.za
                  </div>
                  <div>
                    <span className="font-medium">Response Time:</span> Within 24 hours
                  </div>
                  <div>
                    <span className="font-medium">Available:</span> Monday - Friday, 9:00 AM - 5:00 PM SAST
                  </div>
                </div>
              </div>

            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

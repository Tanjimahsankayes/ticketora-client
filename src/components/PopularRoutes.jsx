import { MapPin, ArrowRight, StarFill } from "@gravity-ui/icons";
import { FaTrainSubway } from "react-icons/fa6";
import { Car, Plane } from "@gravity-ui/icons";
import Link from "next/link";

export default function PopularRoutes() {
  // Routes data array (You can customize these routes)
  const routes = [
    {
      type: "Bus",
      icon: Car,
      from: "Dhaka",
      to: "Cox's Bazar",
      price: "1,200",
      rating: "4.8",
      trips: "20+ Trips Daily",
    },
    {
      type: "Train",
      icon: FaTrainSubway,
      from: "Dhaka",
      to: "Chittagong",
      price: "650",
      rating: "4.9",
      trips: "10 Trips Daily",
    },
    {
      type: "Flight",
      icon: Plane,
      from: "Dhaka",
      to: "Sylhet",
      price: "3,500",
      rating: "4.7",
      trips: "5 Flights Daily",
    },
    {
      type: "Bus",
      icon: Car,
      from: "Chittagong",
      to: "Cox's Bazar",
      price: "500",
      rating: "4.6",
      trips: "30+ Trips Daily",
    },
    {
      type: "Train",
      icon: FaTrainSubway,
      from: "Dhaka",
      to: "Rajshahi",
      price: "700",
      rating: "4.8",
      trips: "8 Trips Daily",
    },
    {
      type: "Flight",
      icon: Plane,
      from: "Dhaka",
      to: "Jessore",
      price: "3,200",
      rating: "4.6",
      trips: "4 Flights Daily",
    },
  ];

  return (
    <section className="w-full bg-[#08090a] py-20 px-6 text-zinc-300 relative overflow-hidden">
      {/* Decorative ambient glows (Matching WhyChooseUs aesthetic) */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tighter">
            Popular Routes
          </h2>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Explore the most traveled routes in Bangladesh, booked by thousands
            daily. Seamlessly connect to your next destination.
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {routes.map((route, index) => (
            <div
              key={index}
              className="bg-[#111215] border border-white/10 rounded-3xl p-7 shadow-2xl transition-all duration-300 hover:border-white/20 hover:bg-[#16171a] space-y-6 flex flex-col group"
            >
              {/* Route Header: Type & Rating */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 bg-zinc-900 border border-white/5 rounded-full px-4 py-2">
                  <route.icon className="w-5 h-5 text-white" />
                  <span className="text-sm text-white font-semibold">
                    {route.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-400 bg-yellow-500/10 rounded-full px-3 py-1">
                  <StarFill className="w-4 h-4" />
                  <span className="text-sm font-bold text-white">
                    {route.rating}
                  </span>
                </div>
              </div>

              {/* Route Details: From - To */}
              <div className="flex items-center justify-center gap-4 py-3 bg-white/5 rounded-2xl relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                  <MapPin className="w-5 h-5 text-zinc-600" />
                  <div className="h-6 w-[2px] bg-zinc-700/50 rounded-full"></div>
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="text-center pl-10">
                  <span className="block text-sm text-zinc-500 font-medium tracking-wide">
                    FROM
                  </span>
                  <span className="block text-2xl font-bold text-white tracking-tight">
                    {route.from}
                  </span>
                </div>
                <ArrowRight className="w-7 h-7 text-white/20 group-hover:text-white transition-colors group-hover:translate-x-1 transition-transform" />
                <div className="text-center">
                  <span className="block text-sm text-zinc-500 font-medium tracking-wide">
                    TO
                  </span>
                  <span className="block text-2xl font-bold text-white tracking-tight">
                    {route.to}
                  </span>
                </div>
              </div>

              {/* Route Footer: Price & Trips */}
              <div className="flex items-end justify-between gap-4 pt-3 flex-grow">
                <div>
                  <span className="block text-xs text-zinc-500 font-medium tracking-wide">
                    STARTING FROM
                  </span>
                  <span className="block text-2xl font-extrabold text-white">
                    BDT {route.price}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-zinc-500 font-medium tracking-wide">
                    FREQUENCY
                  </span>
                  <span className="block text-sm text-white font-semibold whitespace-nowrap">
                    {route.trips}
                  </span>
                </div>
              </div>

              {/* Book Now Button (Matching overall button style) */}
              <Link
                href="/booking"
                className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3 px-6 rounded-xl text-base flex items-center justify-center gap-2.5 transition-all duration-150 shadow-lg group-hover:shadow-white/5"
              >
                <span>Book Tickets</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { MapPin, ArrowRight, StarFill } from "@gravity-ui/icons";
import { FaTrainSubway } from "react-icons/fa6";
import { Car, Plane } from "@gravity-ui/icons";
import Link from "next/link";

export default function PopularRoutes() {
  // Routes data array
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
    <section className="relative isolate overflow-hidden bg-slate-50 py-12 transition-colors duration-300 sm:py-16 dark:bg-slate-950">
      {/* Background ambient blur matching previous design */}
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-600/10" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-600/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl dark:text-white">
            Popular Routes
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Explore the most traveled routes in Bangladesh, booked by thousands
            daily. Seamlessly connect to your next destination.
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {routes.map((route, index) => (
            <div
              key={index}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400/30"
            >
              <div className="space-y-4">
                {/* Route Header: Type Badge & Rating */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    <route.icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{route.type}</span>
                  </div>

                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <StarFill className="h-3.5 w-3.5" />
                    <span>{route.rating}</span>
                  </div>
                </div>

                {/* Route Details: From - To */}
                <div className="relative flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="h-4 w-4 shrink-0 text-indigo-500" />
                    <div className="min-w-0">
                      <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        FROM
                      </span>
                      <span className="block truncate text-base font-bold text-slate-900 dark:text-white">
                        {route.from}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 shrink-0 text-indigo-500 transition-transform group-hover:translate-x-1 dark:text-indigo-400" />

                  <div className="text-right min-w-0">
                    <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      TO
                    </span>
                    <span className="block truncate text-base font-bold text-slate-900 dark:text-white">
                      {route.to}
                    </span>
                  </div>
                </div>

                {/* Route Info: Price & Frequency */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Starting From
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      ৳{route.price}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Frequency
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {route.trips}
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              <div className="mt-5 border-t border-slate-100 pt-3.5 dark:border-slate-800/80">
                <Link
                  href="/all-tickets"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  <span>Book Tickets</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Magnifier,
} from "@gravity-ui/icons";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const slides = [
    {
      id: 1,
      image: "/images/car.jpg",
      title: "Explore Bangladesh Without Boundaries",
      subtitle:
        "Book Bus, Train, and Flight tickets seamlessly with Ticketora.",
      buttonText: "Book Tickets Now",
      buttonLink: "/all-tickets",
    },
    {
      id: 2,
      image: "/images/metro.jpg",
      title: "Rapid Train Reservations",
      subtitle:
        "Enjoy comfortable and hassle-free train journeys across the country.",
      buttonText: "Find Trains",
      buttonLink: "/all-tickets",
    },
    {
      id: 3,
      image: "/images/buses.jpg",
      title: "Premium & Luxury Bus Journeys",
      subtitle:
        "Travel to Cox's Bazar, Sylhet, and Chittagong in top-tier comfort.",
      buttonText: "Explore Buses",
      buttonLink: "/all-tickets",
    },
    {
      id: 4,
      image: "/images/plain.jpg",
      title: "Fly High With Best Deals",
      subtitle:
        "Get instant flight ticketing with unbeatable prices and zero hidden fees.",
      buttonText: "Search Flights",
      buttonLink: "/all-tickets",
    },
    {
      id: 5,
      image: "/images/train.jpg",
      title: "Exclusive Travel Offers & Discounts",
      subtitle:
        "Unlock special promo codes and save big on your next destination.",
      buttonText: "View Offers",
      buttonLink: "/all-tickets",
    },
    {
      id: 6,
      image: "/images/buses.jpg",
      title: "24/7 Dedicated Travel Support",
      subtitle:
        "We are always here to help you plan, book, and enjoy your journey.",
      buttonText: "Contact Us",
      buttonLink: "/contact",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-tickets?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/all-tickets");
    }
  };

  return (
    <section className="relative w-full h-[88vh] min-h-[650px] bg-slate-50 dark:bg-[#08090a] overflow-hidden text-slate-800 dark:text-white flex items-center justify-center transition-colors duration-300">
      {/* Background Images Layer */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{
            backgroundImage: `url('${slide.image}')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Theme-Adaptive Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent dark:from-[#08090a] dark:via-[#08090a]/85 dark:to-transparent" />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        </div>
      ))}

      {/* Decorative Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500/15 dark:bg-teal-500/20 rounded-full blur-[120px] pointer-events-none z-20" />

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 flex flex-col justify-center h-full">
        <div className="max-w-3xl space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-300 dark:text-teal-400 shadow-sm">
            <span>Ticketora Premium Travel</span>
          </div>

          {/* Title & Subtitle */}
          <div className="min-h-[140px] sm:min-h-[160px] flex flex-col justify-center space-y-3">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white transition-all duration-500">
              {slides[currentSlide].title}
            </h1>
            <p className="text-base sm:text-lg text-slate-200 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          {/* Global Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-2xl max-w-xl transition-all"
          >
            <div className="flex items-center pl-3 pr-2 text-teal-600 dark:text-teal-400">
              <Magnifier className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search buses, trains, flights, destinations..."
              className="w-full bg-transparent border-none focus:outline-none text-slate-800 dark:text-white placeholder-slate-400 text-sm sm:text-base px-2 py-2"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shrink-0"
            >
              Search
            </button>
          </form>

          {/* Action Button */}
          <div className="pt-2">
            <Link
              href={slides[currentSlide].buttonLink}
              className="inline-flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-semibold px-7 py-3.5 rounded-xl text-sm sm:text-base transition-all duration-200 shadow-xl hover:scale-105 active:scale-95"
            >
              <span>{slides[currentSlide].buttonText}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows (Desktop) */}
      <div className="absolute bottom-10 right-10 z-30 hidden sm:flex items-center gap-3">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all active:scale-95 shadow-sm"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all active:scale-95 shadow-sm"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-teal-400 dark:bg-white"
                : "w-2.5 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "@gravity-ui/icons";

export default function Hero() {
  const slides = [
    {
      id: 1,
      image: "/images/car.jpg", // public/images/hero/slide1.jpg এ ছবি রাখুন
      title: "Explore Bangladesh Without Boundries",
      subtitle:
        "Book Bus, Train, and Flight tickets seamlessly with Ticketora.",
      buttonText: "Book Tickets Now",
      buttonLink: "/tickets",
    },
    {
      id: 2,
      image: "/images/metro.jpg",
      title: "Rapid Train Reservations",
      subtitle:
        "Enjoy comfortable and hassle-free train journeys across the country.",
      buttonText: "Find Trains",
      buttonLink: "/tickets?type=train",
    },
    {
      id: 3,
      image: "/images/buses.jpg",
      title: "Premium & Luxury Bus Journeys",
      subtitle:
        "Travel to Cox's Bazar, Sylhet, and Chittagong in top-tier comfort.",
      buttonText: "Explore Buses",
      buttonLink: "/tickets?type=bus",
    },
    {
      id: 4,
      image: "/images/plain.jpg",
      title: "Fly High With Best Deals",
      subtitle:
        "Get instant flight ticketing with unbeatable prices and zero hidden fees.",
      buttonText: "Search Flights",
      buttonLink: "/tickets?type=flight",
    },
    {
      id: 5,
      image: "/images/train.jpg",
      title: "Exclusive Travel Offers & Discounts",
      subtitle:
        "Unlock special promo codes and save big on your next destination.",
      buttonText: "View Offers",
      buttonLink: "/offers",
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

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] bg-[#08090a] overflow-hidden text-white flex items-center justify-center">
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
          {/* Dark Overlay with Blur Effects to match app design */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090a] via-[#08090a]/80 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Decorative Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none z-20" />

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 flex flex-col justify-center h-full">
        <div className="max-w-2xl space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <span>Ticketora Premium Travel</span>
          </div>

          {/* Title & Subtitle with smooth transition */}
          <div className="min-h-[160px] flex flex-col justify-center space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight transition-all duration-500 text-white">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Link
              href={slides[currentSlide].buttonLink}
              className="inline-flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-xl hover:scale-105 active:scale-95"
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
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white backdrop-blur-md transition-all active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white backdrop-blur-md transition-all active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-2.5 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
    
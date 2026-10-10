"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Globe,
  Ticket,
  Rocket,
} from "@gravity-ui/icons";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FaHandshakeSimple } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import { GoZap } from "react-icons/go";

export default function AboutPage() {
  // Key Stats Data
  const stats = [
    { label: "Active Passengers", value: "500K+" },
    { label: "Partner Operators", value: "120+" },
    { label: "Daily Routes", value: "1,500+" },
    { label: "Customer Rating", value: "4.9/5" },
  ];

  // Core Values Data
  const values = [
    {
      icon: GoZap,
      title: "Speed & Simplicity",
      description:
        "We eliminate ticket booking hassle with a lightning-fast, intuitive digital experience.",
    },
    {
      icon: ShieldCheck,
      title: "Uncompromised Trust",
      description:
        "Every transaction is encrypted with enterprise-grade security protocols.",
    },
    {
      icon: FaHandshakeSimple,
      title: "Reliable Partnerships",
      description:
        "We work exclusively with verified bus, train, and airline services nationwide.",
    },
  ];

  // Team Members Data
  const team = [
    {
      name: "Kayes Ahmed",
      role: "Founder & CEO",
      image: "/images/member1.png",
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
    {
      name: "Tanvir Rahman",
      role: "Head of Product",
      image: "/images/member2.jpg",
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
    {
      name: "Aysa Rahman",
      role: "Lead Engineer",
      image: "/images/member3.jpg",
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
    {
      name: "Sajid Hasan",
      role: "Customer Success Lead",
      image: "/images/member4.jpg",
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b12] text-slate-700 dark:text-slate-300 py-16 px-6 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Ambient Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] bg-blue-600/5 dark:bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-24">
        {/* 1. Hero / Header Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-slate-900/80 border border-blue-200/80 dark:border-slate-800 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400 shadow-sm">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Redefining Travel Across Bangladesh</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Connecting People, Places & Journeys
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Ticketora is Bangladesh's all-in-one digital ticketing platform
            built to make bus, train, and flight travel seamless, transparent,
            and completely effortless.
          </p>
        </div>

        {/* 2. Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white dark:bg-[#0d121f] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/40 dark:shadow-none">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <span className="block text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="block text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* 3. Our Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Rocket className="w-4 h-4" />
              <span>Our Purpose</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Making Modern Travel Accessible For Everyone
            </h2>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
              Long queues and last-minute booking stress should belong to the
              past. Ticketora was created to empower travelers with real-time
              seat selection, instant digital e-tickets, and transparent fare
              breakdowns.
            </p>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
              Whether you are commuting across major cities by train, taking an
              AC bus to Cox's Bazar, or catching a domestic flight, Ticketora
              ensures your journey starts with total peace of mind.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0d121f] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 space-y-6 shadow-xl shadow-slate-200/30 dark:shadow-none relative overflow-hidden">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-slate-900/90 border border-blue-100 dark:border-slate-800 rounded-2xl w-fit text-blue-600 dark:text-blue-400 shadow-sm">
                <Ticket className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Why Ticketora?
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We combine modern cloud infrastructure with local payment
                integrations like bKash, Nagad, and local bank cards to deliver
                the fastest checkout experience in the country.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                100% Digital E-Tickets
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Instant Confirmation
              </span>
            </div>
          </div>
        </div>

        {/* 4. Core Values */}
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Our Core Principles
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
              The values that drive every line of code and customer decision we
              make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, index) => {
              const IconComponent = val.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-[#0d121f] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 space-y-5 hover:border-blue-500/50 dark:hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-slate-200/20 dark:shadow-none"
                >
                  <div className="p-3.5 bg-blue-50 dark:bg-slate-900/90 border border-blue-100 dark:border-slate-800 rounded-2xl w-fit text-blue-600 dark:text-blue-400 shadow-sm">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {val.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Team Section */}
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <HiMiniUserGroup className="w-4 h-4" />
              <span>Meet The Minds</span>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Behind Ticketora
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
              A passionate group of engineers, designers, and travel enthusiasts
              building the future of travel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#0d121f] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 space-y-5 text-center group hover:border-blue-500/50 dark:hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-slate-200/20 dark:shadow-none"
              >
                {/* Team Avatar Container */}
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800/80 ring-4 ring-slate-100 dark:ring-slate-800/60 group-hover:ring-blue-500/30 transition-all">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    {member.name}
                  </h3>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {member.role}
                  </span>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-2.5 pt-1">
                  <a
                    href={member.facebook}
                    className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
                    aria-label={`${member.name} Facebook`}
                  >
                    <FaFacebookF className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={member.twitter}
                    className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
                    aria-label={`${member.name} Twitter`}
                  >
                    <FaTwitter className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={member.linkedin}
                    className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <FaLinkedinIn className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Call to Action (CTA) */}
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-600/90 dark:to-indigo-900/90 rounded-3xl p-10 sm:p-14 text-center space-y-6 text-white shadow-2xl shadow-blue-500/20 overflow-hidden">
          {/* Subtle Graphic Accent */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Plan Your Next Journey?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Book your tickets in less than 2 minutes and experience
              hassle-free travel today.
            </p>
          </div>

          <div className="relative z-10">
            <Link
              href="/all-tickets"
              className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-100 text-blue-700 font-bold py-3.5 px-8 rounded-xl text-base transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
            >
              <span>Explore Routes</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

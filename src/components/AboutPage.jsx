"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Handshake,
  ArrowRight,
  Globe,
  UsersGroup,
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
      name: "Tanvir Ahmed",
      role: "Founder & CEO",
      image: "/images/team/member1.jpg", // Add team images in public/images/team/
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
    {
      name: "Ayesha Rahman",
      role: "Head of Product",
      image: "/images/team/member2.jpg",
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
    {
      name: "Sajid Hasan",
      role: "Lead Engineer",
      image: "/images/team/member3.jpg",
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
    {
      name: "Nusrat Jahan",
      role: "Customer Success Lead",
      image: "/images/team/member4.jpg",
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090a] text-zinc-300 py-16 px-6 relative overflow-hidden">
      {/* Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-28">
        {/* 1. Hero / Header Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <Globe className="w-4 h-4 text-white" />
            <span>Redefining Travel Across Bangladesh</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Connecting People, Places & Journeys
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Ticketora is Bangladesh's all-in-one digital ticketing platform
            built to make bus, train, and flight travel seamless, transparent,
            and completely effortless.
          </p>
        </div>

        {/* 2. Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-[#111215] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <span className="block text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {stat.value}
              </span>
              <span className="block text-xs sm:text-sm text-zinc-400 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* 3. Our Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Rocket className="w-4 h-4 text-white" />
              <span>Our Purpose</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Making Modern Travel Accessible For Everyone
            </h2>
            <p className="text-zinc-400 leading-relaxed text-base">
              Long queues and last-minute booking stress should belong to the
              past. Ticketora was created to empower travelers with real-time
              seat selection, instant digital e-tickets, and transparent fare
              breakdowns.
            </p>
            <p className="text-zinc-400 leading-relaxed text-base">
              Whether you are commuting across major cities by train, taking an
              AC bus to Cox's Bazar, or catching a domestic flight, Ticketora
              ensures your journey starts with total peace of mind.
            </p>
          </div>

          <div className="bg-[#111215] border border-white/10 rounded-3xl p-8 space-y-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="p-3 bg-zinc-900 border border-white/5 rounded-2xl w-fit text-white">
                <Ticket className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Why Ticketora?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We combine modern cloud infrastructure with local payment
                integrations like Bkash, Nagad, and local bank cards to deliver
                the fastest checkout experience in the country.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">
                100% Digital E-Tickets
              </span>
              <span className="text-xs text-zinc-500 font-medium">
                Instant Confirmation
              </span>
            </div>
          </div>
        </div>

        {/* 4. Core Values */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Our Core Principles
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              The values that drive every line of code and customer decision we
              make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, index) => (
              <div
                key={index}
                className="bg-[#111215] border border-white/10 rounded-3xl p-8 space-y-6 hover:border-white/20 transition-all"
              >
                <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl w-fit text-white">
                  <val.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {val.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Team Section */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <HiMiniUserGroup className="w-4 h-4 text-white" />
              <span>Meet The Minds</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Behind Ticketora
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              A passionate group of engineers, designers, and travel enthusiasts
              building the future of travel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-[#111215] border border-white/10 rounded-3xl p-6 space-y-5 text-center group hover:border-white/20 transition-all"
              >
                {/* Team Avatar Container */}
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden bg-zinc-900 border-2 border-white/10 group-hover:border-white/30 transition-all">
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-medium text-xs">
                    {/* Placeholder image if local image isn't available yet */}
                    <span>{member.name.split(" ")[0]} Photo</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {member.name}
                  </h3>
                  <span className="text-xs text-zinc-500 font-medium">
                    {member.role}
                  </span>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <a
                    href={member.facebook}
                    className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                  >
                    <FaFacebookF className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={member.twitter}
                    className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                  >
                    <FaTwitter className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={member.linkedin}
                    className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                  >
                    <FaLinkedinIn className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Call to Action (CTA) */}
        <div className="bg-[#111215] border border-white/10 rounded-3xl p-10 sm:p-14 text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Plan Your Next Journey?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Book your tickets in less than 2 minutes and experience
              hassle-free travel today.
            </p>
          </div>

          <div>
            <Link
              href="/tickets"
              className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-200 text-black font-semibold py-3.5 px-8 rounded-xl text-base transition-all duration-150 shadow-xl hover:scale-105 active:scale-95"
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

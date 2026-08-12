import Link from "next/link";
import { Car, Envelope, Handset, LogoFacebook } from "@gravity-ui/icons";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "All Tickets", href: "/tickets" },
    { name: "Contact Us", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  return (
    <footer className="w-full bg-[#08090a] border-t border-white/10 text-zinc-400 text-sm">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Responsive Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand Logo & Description */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity w-fit"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded bg-white text-black p-1">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Ticketora
              </span>
            </Link>
            <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
              Book bus, train, launch & flight tickets easily. Your trusted
              platform for seamless travel bookings.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-150 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Contact Info</h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href="mailto:support@tickettora.com"
                  className="flex items-center gap-2.5 hover:text-white transition-colors duration-150"
                >
                  <Envelope className="w-4 h-4 text-zinc-300 shrink-0" />
                  <span>support@tickettora.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801234567890"
                  className="flex items-center gap-2.5 hover:text-white transition-colors duration-150"
                >
                  <Handset className="w-4 h-4 text-zinc-300 shrink-0" />
                  <span>+880 1234-567890</span>
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition-colors duration-150"
                >
                  <LogoFacebook className="w-4 h-4 text-zinc-300 shrink-0" />
                  <span>TicketToraFacebook</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">
              Payment Methods
            </h3>
            <p className="text-xs text-zinc-400">
              We accept secure online payments via Stripe and local providers.
            </p>
            {/* Payment Badge / Cards */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Stripe Badge */}
              <div className="bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-md text-zinc-200 text-xs font-semibold tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Stripe
              </div>
              <div className="bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-md text-zinc-200 text-xs font-semibold">
                Visa
              </div>
              <div className="bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-md text-zinc-200 text-xs font-semibold">
                Mastercard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-zinc-500">
        © 2025 TicketTora. All rights reserved.
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Envelope, Handset, LogoFacebook } from "@gravity-ui/icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "All Tickets", href: "/all-tickets" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund" },
  ];

  return (
    <footer className="relative w-full bg-slate-50 dark:bg-[#090d16] border-t border-slate-200/80 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
      {/* Top Accent Gradient Line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 dark:from-blue-500 dark:via-indigo-400 dark:to-sky-400 opacity-90" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <Link
              href="/"
              aria-label="Ticketora Home"
              className="inline-block group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            >
              <div className="rounded-xl bg-white dark:bg-slate-900/90 p-2 shadow-sm border border-slate-200/60 dark:border-slate-800 inline-block transition-transform duration-200 group-hover:scale-[1.02]">
                <Image
                  src="/images/TicketoraLogo.png"
                  alt="Ticketora"
                  width={180}
                  height={40}
                  priority
                  className="h-8 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm">
              Book bus, train, launch & flight tickets easily. Your trusted
              platform for seamless travel bookings across the country.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 inline-flex items-center gap-1.5 transform hover:translate-x-1"
                  >
                    <span className="h-1 w-1 rounded-full bg-blue-500 opacity-0 hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href="mailto:support@tickettora.com"
                  className="group flex items-center gap-3 p-1.5 -ml-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
                >
                  <div className="p-2 rounded-md bg-white dark:bg-slate-800/80 shadow-sm border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Envelope className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="truncate">support@tickettora.com</span>
                </a>
              </li>

              <li>
                <a
                  href="tel:+8801234567890"
                  className="group flex items-center gap-3 p-1.5 -ml-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
                >
                  <div className="p-2 rounded-md bg-white dark:bg-slate-800/80 shadow-sm border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Handset className="w-4 h-4 shrink-0" />
                  </div>
                  <span>+880 1234-567890</span>
                </a>
              </li>

              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-1.5 -ml-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
                >
                  <div className="p-2 rounded-md bg-white dark:bg-slate-800/80 shadow-sm border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <LogoFacebook className="w-4 h-4 shrink-0" />
                  </div>
                  <span>TicketTora Facebook</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-sm uppercase tracking-wider">
              Secure Payments
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We accept safe and encrypted online payments through industry
              leaders.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-medium shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Stripe
              </span>
              <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-medium shadow-sm">
                Visa
              </span>
              <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-medium shadow-sm">
                Mastercard
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal Links Bar */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-[#070a11]/60 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {currentYear}{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              TicketTora
            </span>
            . All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {legalLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

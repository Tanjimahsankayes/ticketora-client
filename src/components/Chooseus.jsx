import { ShieldCheck, ThumbsUp } from "@gravity-ui/icons";
import { FaTrainSubway } from "react-icons/fa6";
import { Car, Plane } from "@gravity-ui/icons";
import { FaHandshakeSimple } from "react-icons/fa6";
import { GoZap } from "react-icons/go";

export default function WhyChooseUs() {
  // Features data array
  const features = [
    {
      icon: ShieldCheck,
      title: "Secure Bookings",
      description:
        "Your data and transactions are protected by industry-leading security protocols.",
    },
    {
      icon: GoZap,
      title: "Instant Confirmation",
      description:
        "Get your tickets confirmed immediately after payment, no waiting required.",
    },
    {
      icon: FaHandshakeSimple,
      title: "Trusted Partners",
      description:
        "We collaborate only with verified and reliable travel operators.",
    },
    {
      icon: ThumbsUp,
      title: "Easy Cancellations",
      description:
        "Flexible booking options with straightforward cancellation policies.",
    },
  ];

  // Icons for decorative purpose
  const travelIcons = [
    { icon: Car, label: "Bus" },
    { icon: FaTrainSubway, label: "Train" },
    { icon: Plane, label: "Flight" },
  ];

  return (
    <section className="w-full bg-slate-50 dark:bg-[#08090a] py-20 px-6 text-slate-700 dark:text-zinc-300 relative overflow-hidden theme-transition">
      {/* Decorative ambient glows */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tighter">
            Why Choose TicketTora?
          </h2>
          <p className="text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Experience seamless travel booking with unmatched reliability and
            service. Here's what sets us apart.
          </p>
        </div>

        {/* Travel Type Icons (Decorative) */}
        <div className="flex items-center justify-center gap-6 mb-20">
          {travelIcons.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="p-4 bg-slate-200 dark:bg-zinc-900 border border-slate-300 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white">
                <item.icon className="w-10 h-10" />
              </div>
              <span className="text-sm text-slate-500 dark:text-zinc-500 font-medium max-w-[100px]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#111215] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#16171a] space-y-6 flex flex-col items-start"
            >
              {/* Feature Icon */}
              <div className="p-4 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white">
                <feature.icon className="w-8 h-8" />
              </div>

              {/* Feature Title */}
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed flex-grow">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

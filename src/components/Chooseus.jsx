import { ShieldCheck, ThumbsUp } from "@gravity-ui/icons";
import { FaTrainSubway, FaHandshakeSimple } from "react-icons/fa6";
import { Car, Plane } from "@gravity-ui/icons";
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

  // Travel Mode Icons
  const travelIcons = [
    { icon: Car, label: "Bus" },
    { icon: FaTrainSubway, label: "Train" },
    { icon: Plane, label: "Flight" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-slate-50 py-12 transition-colors duration-300 sm:py-16 dark:bg-slate-950">
      {/* Background ambient blur */}
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-600/10" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-600/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center sm:mb-12">
          <div className="mb-2.5 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            Unmatched Reliability
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl dark:text-white">
            Why Choose TicketTora?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Experience seamless travel booking with unmatched reliability and
            service. Here's what sets us apart.
          </p>
        </div>

        {/* Decorative Travel Mode Icons */}
        <div className="mb-12 flex items-center justify-center gap-6 sm:gap-10">
          {travelIcons.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-indigo-300 group-hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:group-hover:border-indigo-400/30">
                <item.icon className="h-6 w-6 text-indigo-600 transition-colors group-hover:text-violet-600 dark:text-indigo-400 dark:group-hover:text-violet-400" />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-start overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400/30"
            >
              {/* Feature Icon Badge */}
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-500/10 dark:text-indigo-400 dark:group-hover:bg-indigo-500 dark:group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Feature Title */}
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

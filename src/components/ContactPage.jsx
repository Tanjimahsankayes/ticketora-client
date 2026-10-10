"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Envelope,
  Handset,
  MapPin,
  Clock,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  CircleCheck,
} from "@gravity-ui/icons";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulated form submission
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const faqs = [
    {
      question: "How can I cancel or refund my ticket?",
      answer:
        "You can easily request a cancellation or refund directly from your Dashboard under 'My Bookings'. Cancellation policies depend on the specific travel operator.",
    },
    {
      question: "Where will I get my e-ticket after booking?",
      answer:
        "Once your payment is confirmed, your e-ticket will be sent to your registered email address instantly. You can also view and download it anytime from your Profile Dashboard.",
    },
    {
      question: "What should I do if my payment fails but money was deducted?",
      answer:
        "Don't worry! In case of a failed transaction where money was deducted, the amount is automatically refunded back to your bank account or MFS wallet within 3 to 5 working days.",
    },
    {
      question: "Can I change my travel date after booking?",
      answer:
        "Date changes depend on the seat availability and travel operator guidelines. Please contact our support team at least 12 hours before departure to request a schedule change.",
    },
  ];

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-50 px-4 py-12 text-slate-700 transition-colors duration-300 sm:px-6 sm:py-16 lg:px-8 dark:bg-slate-950 dark:text-slate-300">
      {/* Background Ambient Blur */}
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-600/10" />
      <div className="pointer-events-none absolute -right-32 bottom-10 -z-10 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-600/10" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-16">
        {/* Page Header */}
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Envelope className="h-3.5 w-3.5" />
            <span>24/7 Dedicated Support</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
            Get in Touch With Us
          </h1>
          <p className="mx-auto max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Have questions about your booking, ticket confirmation, or route
            options? We're here to help you around the clock.
          </p>
        </div>

        {/* Contact Main Grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Side: Contact Info & Support Channels */}
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white">
                Contact Information
              </h2>
              <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                Reach out to us through any of the channels below or fill out
                the form. Our support team responds within minutes!
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              <div className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400/30">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-500/10 dark:text-indigo-400 dark:group-hover:bg-indigo-500 dark:group-hover:text-white">
                  <Handset className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Call Us
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-slate-900 dark:text-white">
                    +880 1700-000000
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                    Available 24/7 for urgent assistance
                  </span>
                </div>
              </div>

              <div className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400/30">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-500/10 dark:text-indigo-400 dark:group-hover:bg-indigo-500 dark:group-hover:text-white">
                  <Envelope className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Email Support
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-slate-900 dark:text-white">
                    support@ticketora.com
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                    Typical response time: Within 1 hour
                  </span>
                </div>
              </div>

              <div className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400/30">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-500/10 dark:text-indigo-400 dark:group-hover:bg-indigo-500 dark:group-hover:text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Head Office
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-slate-900 dark:text-white">
                    Level 4, Ticketora Tower, Gulshan-2, Dhaka
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                    Open Mon - Fri (9:00 AM - 6:00 PM)
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-2.5 pt-2">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Follow Ticketora
              </span>
              <div className="flex items-center gap-2.5">
                {[
                  { icon: FaFacebookF, href: "#" },
                  { icon: FaTwitter, href: "#" },
                  { icon: FaInstagram, href: "#" },
                  { icon: FaLinkedinIn, href: "#" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white">
              Send Us a Message
            </h2>
            <p className="mb-6 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Fill in the form below and we will get back to you as soon as
              possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tanvir Ahmed"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Booking Cancellation Query"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Quick answers to common questions about booking and cancellation.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? "border-indigo-200 bg-white shadow-sm dark:border-indigo-400/30 dark:bg-slate-900"
                      : "border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-4 text-left focus:outline-none sm:p-5"
                  >
                    <span className="text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-400 ${
                        isOpen
                          ? "rotate-180 text-indigo-600 dark:text-indigo-400"
                          : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 px-4 pb-4 pt-3 text-xs leading-relaxed text-slate-500 sm:px-5 sm:pb-5 sm:text-sm dark:border-slate-800/80 dark:text-slate-400">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

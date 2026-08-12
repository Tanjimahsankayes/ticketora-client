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

    // সিমুলেটেড ফর্ম সাবমিশন
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
    <div className="min-h-screen bg-[#08090a] text-zinc-300 py-16 px-6 relative overflow-hidden">
      {/* Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <Envelope className="w-4 h-4 text-white" />
            <span>24/7 Dedicated Support</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Get in Touch With Us
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Have questions about your booking, ticket confirmation, or route
            options? We're here to help you around the clock.
          </p>
        </div>

        {/* Contact Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Contact Info & Support Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Contact Information
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Reach out to us through any of the channels below or fill out
                the form. Our support team responds within minutes!
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="bg-[#111215] border border-white/10 rounded-2xl p-5 flex items-start gap-4 transition-colors hover:border-white/20">
                <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-white shrink-0">
                  <Handset className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider">
                    Call Us
                  </span>
                  <span className="block text-base font-semibold text-white mt-0.5">
                    +880 1700-000000
                  </span>
                  <span className="block text-xs text-zinc-400 mt-1">
                    Available 24/7 for urgent assistance
                  </span>
                </div>
              </div>

              <div className="bg-[#111215] border border-white/10 rounded-2xl p-5 flex items-start gap-4 transition-colors hover:border-white/20">
                <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-white shrink-0">
                  <Envelope className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider">
                    Email Support
                  </span>
                  <span className="block text-base font-semibold text-white mt-0.5">
                    support@ticketora.com
                  </span>
                  <span className="block text-xs text-zinc-400 mt-1">
                    Typical response time: Within 1 hour
                  </span>
                </div>
              </div>

              <div className="bg-[#111215] border border-white/10 rounded-2xl p-5 flex items-start gap-4 transition-colors hover:border-white/20">
                <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-white shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider">
                    Head Office
                  </span>
                  <span className="block text-base font-semibold text-white mt-0.5">
                    Level 4, Ticketora Tower, Gulshan-2, Dhaka
                  </span>
                  <span className="block text-xs text-zinc-400 mt-1">
                    Open Mon - Fri (9:00 AM - 6:00 PM)
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 space-y-3">
              <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider">
                Follow Ticketora
              </span>
              <div className="flex items-center gap-3">
                {[
                  { icon: FaFacebookF, href: "#" },
                  { icon: FaTwitter, href: "#" },
                  { icon: FaInstagram, href: "#" },
                  { icon: FaLinkedinIn, href: "#" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="p-3 bg-[#111215] border border-white/10 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-white/20 transition-all"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:col-span-7 bg-[#111215] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              Send Us a Message
            </h2>
            <p className="text-sm text-zinc-400 mb-8">
              Fill in the form below and we will get back to you as soon as
              possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tanvir Ahmed"
                    className="w-full px-4 py-3 bg-[#08090a] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-all text-sm"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-[#08090a] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Booking Cancellation Query"
                  className="w-full px-4 py-3 bg-[#08090a] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-all text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 bg-[#08090a] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-all text-sm resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3.5 px-6 rounded-xl text-base flex items-center justify-center gap-2.5 transition-all duration-150 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-10 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-400 text-sm">
              Quick answers to common questions about booking and cancellation.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#111215] border border-white/10 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-base font-semibold text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 transition-transform duration-200 shrink-0 ${
                      openFaq === index ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

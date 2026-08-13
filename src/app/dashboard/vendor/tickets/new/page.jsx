"use client";

import { creatTicket } from "@/lib/actions/tickets";
import { useSession } from "@/lib/auth-client";
import { Ticket } from "@gravity-ui/icons";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function AddTicketPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    title: "",
    fromLocation: "",
    toLocation: "",
    transportType: "",
    price: "",
    quantity: "",
    departureDateTime: "",
    perks: [],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const perkOptions = [
    "AC",
    "Breakfast",
    "WiFi",
    "Reclining Seat",
    "Water Bottle",
    "Sleeper Berth",
    "Power Outlet",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePerk = (perk) => {
    setFormData((prev) => {
      const isSelected = prev.perks.includes(perk);
      const updatedPerks = isSelected
        ? prev.perks.filter((item) => item !== perk)
        : [...prev.perks, perk];
      return { ...prev, perks: updatedPerks };
    });
  };

  // ImgBB Image Upload Function
  const uploadImageToImgbb = async (file) => {
    if (!file) return "";

    setIsUploading(true);
    try {
      const apiKey =
        process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API ||
        process.env.NEXT_PUBLIC_IMGBB_API_KEY;

      if (!apiKey) {
        throw new Error("ImgBB API Key পাওয়া যায়নি। .env ফাইল চেক করুন।");
      }

      const imageData = new FormData();
      imageData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: imageData,
        },
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "Image upload failed");
      }

      return result.data.display_url || result.data.url;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error(`ইমেজ আপলোড ব্যর্থ হয়েছে: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.perks.length === 0) {
      setStatusMessage({
        type: "error",
        text: "Please select at least one perk.",
      });
      return;
    }

    if (!imageFile) {
      setStatusMessage({
        type: "error",
        text: "Please select a ticket image.",
      });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const imageUrl = await uploadImageToImgbb(imageFile);
      const ticketPayload = {
        title: formData.title,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        transportType: formData.transportType,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        departureDateTime: formData.departureDateTime,
        perks: formData.perks,
        imageUrl,
        vendorName: user?.name || "TravelCorp Ltd.",
        vendorEmail: user?.email || "vendor@travelcorp.com",
        verificationStatus: "pending",
        createdAt: new Date().toISOString(),
      };

      const res = await creatTicket(ticketPayload);

      if (!res?.insertedId) {
        throw new Error("Ticket creation failed in database");
      }

      toast.success("Ticket Created Successfully!");

      setStatusMessage({
        type: "success",
        text: "Ticket successfully submitted! Status set to Pending.",
      });

      setFormData({
        title: "",
        fromLocation: "",
        toLocation: "",
        transportType: "",
        price: "",
        quantity: "",
        departureDateTime: "",
        perks: [],
      });
      setImageFile(null);
      e.target.reset();
    } catch (err) {
      toast.error(err.message);
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans antialiased">
      <div className="max-w-3xl w-full bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800/80 p-8 sm:p-12 relative overflow-hidden">
        {/* Subtle Decorative Ambient Light */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Section */}
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20 shadow-inner">
            <Ticket className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Create New Ticket
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Fill in all required details to list a new travel route on
            TicketOra.
          </p>
        </div>

        {/* Feedback Alert */}
        {statusMessage.text && (
          <div
            className={`mb-8 p-4 rounded-2xl border text-sm font-medium flex items-center space-x-3 transition-all ${
              statusMessage.type === "error"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
          {/* Section 1: Basic Info */}
          <div className="space-y-5 bg-slate-800/30 p-6 rounded-2xl border border-slate-800/60">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Ticket Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g., Luxury Express: Dhaka to Cox's Bazar"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            {/* From & To Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  From (Departure) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="fromLocation"
                  required
                  placeholder="Departure city or terminal"
                  value={formData.fromLocation}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  To (Destination) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="toLocation"
                  required
                  placeholder="Destination city or terminal"
                  value={formData.toLocation}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Logistics */}
          <div className="space-y-5 bg-slate-800/30 p-6 rounded-2xl border border-slate-800/60">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Transport <span className="text-rose-400">*</span>
                </label>
                <select
                  name="transportType"
                  required
                  value={formData.transportType}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm cursor-pointer"
                >
                  <option
                    value=""
                    disabled
                    className="bg-slate-900 text-slate-500"
                  >
                    Select Type
                  </option>
                  <option value="Bus" className="bg-slate-900">
                    Bus
                  </option>
                  <option value="Train" className="bg-slate-900">
                    Train
                  </option>
                  <option value="Flight" className="bg-slate-900">
                    Flight
                  </option>
                  <option value="Ferry" className="bg-slate-900">
                    Ferry
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Price ($) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Quantity <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  required
                  placeholder="100"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Departure Date & Time */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Departure Date & Time <span className="text-rose-400">*</span>
              </label>
              <input
                type="datetime-local"
                name="departureDateTime"
                required
                value={formData.departureDateTime}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Section 3: Perks Section */}
          <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800/60">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Select Perks <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {perkOptions.map((perk) => {
                const active = formData.perks.includes(perk);
                return (
                  <button
                    type="button"
                    key={perk}
                    onClick={() => togglePerk(perk)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border flex items-center space-x-1.5 ${
                      active
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <span>{active ? "✓" : "+"}</span>
                    <span>{perk}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Image Upload Box */}
          <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800/60">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Upload Ticket Banner <span className="text-rose-400">*</span>
            </label>
            <div className="relative border-2 border-dashed border-slate-700/80 hover:border-indigo-500/80 rounded-2xl p-6 text-center transition-all bg-slate-950/40 group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setImageFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-3 rounded-full bg-slate-800/80 text-slate-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    {imageFile ? (
                      <span className="text-indigo-400 font-semibold">
                        {imageFile.name}
                      </span>
                    ) : (
                      "Click or drop ticket image here"
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Vendor Information (Readonly) */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-indigo-400 tracking-wider mb-1">
                Vendor Name
              </label>
              <input
                type="text"
                readOnly
                value={user?.name || "TravelCorp Ltd."}
                className="w-full bg-slate-900/40 border border-slate-800/80 text-slate-400 text-xs px-3 py-2 rounded-lg cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-indigo-400 tracking-wider mb-1">
                Vendor Email
              </label>
              <input
                type="email"
                readOnly
                value={user?.email || "vendor@travelcorp.com"}
                className="w-full bg-slate-900/40 border border-slate-800/80 text-slate-400 text-xs px-3 py-2 rounded-lg cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || isUploading}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-200 transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || isUploading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>
                  {isUploading ? "Uploading Image..." : "Publishing Ticket..."}
                </span>
              </span>
            ) : (
              "Add Ticket"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

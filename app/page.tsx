"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  Users,
  Tv,
  Wifi,
  Mic,
  Thermometer,
  Wind,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Plus,
  Maximize2,
  Minimize2,
  Building2,
  Sparkles,
  Shield,
  Search,
  Video,
  Presentation,
  Volume2,
  SlidersHorizontal,
  X,
  Flame,
  RefreshCw,
} from "lucide-react";

type RoomStatus = "available" | "occupied" | "starting_soon" | "private";

interface Meeting {
  id: string;
  title: string;
  host: string;
  hostRole: string;
  startTime: string;
  endTime: string;
  status: "completed" | "current" | "upcoming";
  attendeesCount: number;
  isPrivate?: boolean;
}

interface RoomInfo {
  id: string;
  name: string;
  code: string;
  floor: string;
  building: string;
  capacity: number;
  temp: string;
  humidity: string;
  airQuality: string;
  amenities: { name: string; icon: any }[];
}

const ROOMS: RoomInfo[] = [
  {
    id: "room-402",
    name: "The Quantum Lab",
    code: "CR-402",
    floor: "4th Floor • West Wing",
    building: "HQ Campus Alpha",
    capacity: 12,
    temp: "21.5°C",
    humidity: "42%",
    airQuality: "410 ppm",
    amenities: [
      { name: "Dual 4K TV", icon: Tv },
      { name: "4K Cam", icon: Video },
      { name: "Ceiling Mic", icon: Mic },
      { name: "Whiteboard", icon: Presentation },
      { name: "Wi-Fi 7", icon: Wifi },
    ],
  },
  {
    id: "room-405",
    name: "Apollo Executive Suite",
    code: "CR-405",
    floor: "4th Floor • East Wing",
    building: "HQ Campus Alpha",
    capacity: 18,
    temp: "22.0°C",
    humidity: "45%",
    airQuality: "460 ppm",
    amenities: [
      { name: "85\" 4K Screen", icon: Tv },
      { name: "Dual Video Bar", icon: Video },
      { name: "Polycom Audio", icon: Volume2 },
    ],
  },
  {
    id: "room-301",
    name: "Nexus Huddle Pod",
    code: "CR-301",
    floor: "3rd Floor • Innovation Hub",
    building: "HQ Campus Alpha",
    capacity: 6,
    temp: "20.8°C",
    humidity: "40%",
    airQuality: "395 ppm",
    amenities: [
      { name: "55\" Ultra HD", icon: Tv },
      { name: "Rally Cam", icon: Video },
      { name: "Wireless Mic", icon: Mic },
    ],
  },
];

const INITIAL_SCHEDULE: Meeting[] = [
  {
    id: "m-1",
    title: "Daily Engineering Standup",
    host: "Alex Vance",
    hostRole: "Lead Architect",
    startTime: "09:00",
    endTime: "09:45",
    status: "completed",
    attendeesCount: 7,
  },
  {
    id: "m-2",
    title: "Product Strategy & Roadmap Sync",
    host: "Manoj Kumar",
    hostRole: "Head of Product",
    startTime: "10:30",
    endTime: "11:30",
    status: "current",
    attendeesCount: 8,
  },
  {
    id: "m-3",
    title: "Q3 Marketing & Growth Sprint",
    host: "Elena Rostova",
    hostRole: "Brand Director",
    startTime: "12:00",
    endTime: "13:00",
    status: "upcoming",
    attendeesCount: 5,
  },
  {
    id: "m-4",
    title: "Design System 3.0 Architecture",
    host: "Liam Chen",
    hostRole: "Staff Designer",
    startTime: "14:00",
    endTime: "15:30",
    status: "upcoming",
    attendeesCount: 10,
  },
  {
    id: "m-5",
    title: "Executive Board Quarterly Sync",
    host: "Sarah Jenkins",
    hostRole: "VP Strategy",
    startTime: "16:30",
    endTime: "17:30",
    status: "upcoming",
    attendeesCount: 12,
    isPrivate: true,
  },
];

export default function MeetingRoomKiosk() {
  const [currentRoom, setCurrentRoom] = useState<RoomInfo>(ROOMS[0]);
  const [roomStatus, setRoomStatus] = useState<RoomStatus>("available");
  const [schedule, setSchedule] = useState<Meeting[]>(INITIAL_SCHEDULE);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Modals
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Booking Form State
  const [bookingTitle, setBookingTitle] = useState("Ad-hoc Quick Sync");
  const [bookingHost, setBookingHost] = useState("Manoj Kumar");
  const [bookingDuration, setBookingDuration] = useState<number>(30);
  const [isBookingPrivate, setIsBookingPrivate] = useState(false);

  // Clock Ticker
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Toast Auto-dismiss
  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // State Switcher Function
  const handleSelectState = (newStatus: RoomStatus) => {
    setRoomStatus(newStatus);
    const label =
      newStatus === "available"
        ? "🟢 AVAILABLE"
        : newStatus === "occupied"
        ? "🔴 IN USE"
        : newStatus === "starting_soon"
        ? "🟡 STARTING SOON"
        : "🔒 PRIVATE";
    setShowToast(`Mode: ${label}`);
  };

  // Cycle states helper
  const cycleRoomState = () => {
    const states: RoomStatus[] = ["available", "occupied", "starting_soon", "private"];
    const nextIdx = (states.indexOf(roomStatus) + 1) % states.length;
    handleSelectState(states[nextIdx]);
  };

  // Instant 1-tap quick book
  const handleQuickBook = (durationMinutes: number) => {
    const now = new Date();
    const startStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const endDate = new Date(now.getTime() + durationMinutes * 60000);
    const endStr = endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

    const newMeeting: Meeting = {
      id: `m-${Date.now()}`,
      title: "Instant Walk-up Meeting",
      host: "Walk-up Organizer",
      hostRole: "Ad-hoc Booking",
      startTime: startStr,
      endTime: endStr,
      status: "current",
      attendeesCount: 2,
    };

    setSchedule((prev) => [
      ...prev.map((m) => (m.status === "current" ? { ...m, status: "completed" as const } : m)),
      newMeeting,
    ]);
    setRoomStatus("occupied");
    setIsCheckedIn(true);
    setShowToast(`🎉 Instant Booking Confirmed (+${durationMinutes}m)`);
  };

  // Submit custom booking
  const handleCustomBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const startStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const endDate = new Date(now.getTime() + bookingDuration * 60000);
    const endStr = endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

    const newMeeting: Meeting = {
      id: `m-${Date.now()}`,
      title: bookingTitle || "Ad-hoc Sync",
      host: bookingHost || "Walk-up Host",
      hostRole: "Meeting Lead",
      startTime: startStr,
      endTime: endStr,
      status: "current",
      attendeesCount: 4,
      isPrivate: isBookingPrivate,
    };

    setSchedule((prev) => [
      ...prev.map((m) => (m.status === "current" ? { ...m, status: "completed" as const } : m)),
      newMeeting,
    ]);
    setRoomStatus(isBookingPrivate ? "private" : "occupied");
    setIsCheckedIn(true);
    setShowBookingModal(false);
    setShowToast(`✨ "${currentRoom.name}" booked until ${endStr}!`);
  };

  // End meeting early
  const handleEndMeetingEarly = () => {
    setRoomStatus("available");
    setIsCheckedIn(false);
    setShowEndModal(false);
    setSchedule((prev) =>
      prev.map((m) => (m.status === "current" ? { ...m, status: "completed" as const } : m))
    );
    setShowToast("✅ Room is now available for walk-ups.");
  };

  // Extend meeting
  const handleExtendMeeting = (mins: number) => {
    setShowExtendModal(false);
    setShowToast(`⏳ Session extended by +${mins}m.`);
  };

  // Current active meeting
  const currentMeeting = schedule.find((m) => m.status === "current") || {
    title: "Product Strategy & Architecture Review",
    host: "Manoj Kumar",
    hostRole: "Head of Product",
    startTime: "10:30",
    endTime: "11:30",
    attendeesCount: 8,
  };

  // Theme styling based on roomStatus
  const statusTheme = {
    available: {
      bgGlow: "from-emerald-950/40 via-zinc-950 to-zinc-950",
      accent: "text-emerald-400",
      badgeBg: "bg-emerald-500/25 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
      rimGlow: "shadow-[0_0_80px_rgba(16,185,129,0.15)]",
      buttonBg: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-zinc-950 font-bold shadow-[0_0_25px_rgba(16,185,129,0.35)]",
      chipBg: "bg-emerald-950/60 hover:bg-emerald-900 border-emerald-500/40 text-emerald-200",
      title: "AVAILABLE NOW",
      indicatorDot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]",
    },
    occupied: {
      bgGlow: "from-rose-950/50 via-zinc-950 to-zinc-950",
      accent: "text-rose-400",
      badgeBg: "bg-rose-500/25 border-rose-500/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]",
      rimGlow: "shadow-[0_0_80px_rgba(244,63,94,0.15)]",
      buttonBg: "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white font-bold shadow-[0_0_25px_rgba(244,63,94,0.35)]",
      chipBg: "bg-rose-950/60 hover:bg-rose-900 border-rose-500/40 text-rose-200",
      title: "ROOM IN USE",
      indicatorDot: "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,1)]",
    },
    starting_soon: {
      bgGlow: "from-amber-950/45 via-zinc-950 to-zinc-950",
      accent: "text-amber-400",
      badgeBg: "bg-amber-500/25 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
      rimGlow: "shadow-[0_0_80px_rgba(245,158,11,0.15)]",
      buttonBg: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-zinc-950 font-bold shadow-[0_0_25px_rgba(245,158,11,0.35)]",
      chipBg: "bg-amber-950/60 hover:bg-amber-900 border-amber-500/40 text-amber-200",
      title: "STARTING IN 6 MINS",
      indicatorDot: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,1)]",
    },
    private: {
      bgGlow: "from-purple-950/45 via-zinc-950 to-zinc-950",
      accent: "text-purple-400",
      badgeBg: "bg-purple-500/25 border-purple-500/60 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
      rimGlow: "shadow-[0_0_80px_rgba(168,85,247,0.15)]",
      buttonBg: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 text-white font-bold shadow-[0_0_25px_rgba(168,85,247,0.35)]",
      chipBg: "bg-purple-950/60 hover:bg-purple-900 border-purple-500/40 text-purple-200",
      title: "CONFIDENTIAL SESSION",
      indicatorDot: "bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,1)]",
    },
  }[roomStatus];

  const timeFormatted = currentTime
    ? currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
    : "10:42 AM";

  const dateFormatted = currentTime
    ? currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    : "Wed, Sep 30";

  return (
    <main
      className={`h-screen max-h-screen w-screen max-w-screen bg-zinc-950 bg-gradient-to-br ${statusTheme.bgGlow} text-zinc-100 flex flex-col justify-between relative overflow-hidden p-3 sm:p-4 lg:p-5 font-sans touch-manipulation`}
    >
      {/* Decorative Halo - STRICTLY POINTER EVENTS NONE */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${statusTheme.rimGlow}`} />
      <div
        className={`absolute top-0 left-0 right-0 h-1 pointer-events-none transition-all duration-700 ${
          roomStatus === "available"
            ? "bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.9)]"
            : roomStatus === "occupied"
            ? "bg-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.9)]"
            : roomStatus === "starting_soon"
            ? "bg-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.9)]"
            : "bg-purple-500 shadow-[0_0_18px_rgba(168,85,247,0.9)]"
        }`}
      />

      {/* Floating Interactive Toast */}
      {showToast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/95 border border-zinc-700 backdrop-blur-xl px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-none">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold text-zinc-100">{showToast}</span>
        </div>
      )}

      {/* ======================= TOP HEADER BAR ======================= */}
      <header className="shrink-0 relative z-30 flex items-center justify-between pb-2 border-b border-zinc-800/80 gap-2">
        {/* Room Info */}
        <div className="flex items-center gap-3">
          <div
            onClick={cycleRoomState}
            className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shadow relative cursor-pointer active:scale-95 touch-manipulation pointer-events-auto"
            title="Tap to cycle room state"
          >
            <Building2 className="w-5 h-5 text-zinc-300" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 pointer-events-none">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusTheme.indicatorDot}`} />
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${statusTheme.indicatorDot}`} />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                {currentRoom.name}
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                {currentRoom.code}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>{currentRoom.floor}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-zinc-400" /> {currentRoom.capacity} Seats
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Thermometer className="w-3 h-3" /> {currentRoom.temp}
              </span>
            </div>
          </div>
        </div>

        {/* PROMINENT DEMO STATE SWITCHER PILLS (DIRECT POINTER / CLICK HANDLERS) */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-700 shadow-xl pointer-events-auto z-40">
          <button
            type="button"
            onClick={() => handleSelectState("available")}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[44px] flex items-center gap-1 ${
              roomStatus === "available"
                ? "bg-emerald-500 text-zinc-950 shadow-md font-extrabold"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800"
            }`}
          >
            🟢 Free
          </button>
          <button
            type="button"
            onClick={() => handleSelectState("occupied")}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[44px] flex items-center gap-1 ${
              roomStatus === "occupied"
                ? "bg-rose-500 text-white shadow-md font-extrabold"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800"
            }`}
          >
            🔴 In Use
          </button>
          <button
            type="button"
            onClick={() => handleSelectState("starting_soon")}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[44px] flex items-center gap-1 ${
              roomStatus === "starting_soon"
                ? "bg-amber-500 text-zinc-950 shadow-md font-extrabold"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800"
            }`}
          >
            🟡 Soon
          </button>
          <button
            type="button"
            onClick={() => handleSelectState("private")}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[44px] flex items-center gap-1 ${
              roomStatus === "private"
                ? "bg-purple-500 text-white shadow-md font-extrabold"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800"
            }`}
          >
            🔒 Private
          </button>
        </div>

        {/* Clock & Action Controls */}
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-mono leading-none">
              {timeFormatted}
            </div>
            <div className="text-[10px] font-medium text-zinc-400 mt-0.5">{dateFormatted}</div>
          </div>


          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all shadow cursor-pointer touch-manipulation pointer-events-auto min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Mobile QR Pass"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all shadow cursor-pointer touch-manipulation pointer-events-auto min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ======================= MAIN BODY (ZERO SCROLL) ======================= */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 my-2 overflow-hidden relative z-10">
        {/* LEFT COLUMN: HERO STATUS & 1-TAP BOOKING */}
        <div className="lg:col-span-7 h-full flex flex-col justify-between bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
          {/* Subtle watermark */}
          <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
            <Sparkles className="w-48 h-48 text-white" />
          </div>

          <div className="flex-1 min-h-0 flex flex-col justify-between">
            {/* Live Status Badge */}
            <div className="flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={cycleRoomState}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold tracking-wide uppercase transition-all cursor-pointer touch-manipulation pointer-events-auto active:scale-95 ${statusTheme.badgeBg}`}
                title="Tap to cycle status"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${statusTheme.indicatorDot} animate-pulse`} />
                <span>{statusTheme.title}</span>
                <RefreshCw className="w-3.5 h-3.5 ml-1 opacity-70" />
              </button>

              {roomStatus === "occupied" && (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1 bg-rose-950/50 px-3 py-1 rounded-full border border-rose-500/30">
                  <Clock className="w-3.5 h-3.5 animate-spin-slow" /> Ends in 38 mins (11:30 AM)
                </span>
              )}

              {roomStatus === "available" && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Walk-up Ready
                </span>
              )}
            </div>

            {/* Dynamic Status View */}
            {roomStatus === "available" && (
              <div className="my-auto py-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Room is Free
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                  Next meeting starts at <span className="font-semibold text-white">11:30 AM</span> (Elena Rostova - Marketing).
                </p>

                {/* Instant Quick Book Chips */}
                <div className="mt-3.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-emerald-400" /> 1-Tap Instant Walk-in Booking
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 30, 45, 60].map((mins) => (
                      <button
                        type="button"
                        key={mins}
                        onClick={() => handleQuickBook(mins)}
                        className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow cursor-pointer touch-manipulation pointer-events-auto min-h-[56px] ${statusTheme.chipBg}`}
                      >
                        <span className="text-[10px] text-zinc-400 font-medium">Duration</span>
                        <span className="text-base sm:text-lg font-bold text-white tracking-tight">+{mins}m</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {roomStatus === "occupied" && (
              <div className="my-auto py-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
                  Current Session
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
                  {currentMeeting.title}
                </h2>

                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white text-xs shadow">
                      {currentMeeting.host.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-xs">{currentMeeting.host}</div>
                      <div className="text-[10px] text-zinc-400">{currentMeeting.hostRole}</div>
                    </div>
                  </div>
                  <div className="h-4 w-px bg-zinc-700 hidden sm:block" />
                  <div className="flex items-center gap-1 text-zinc-300">
                    <Users className="w-3.5 h-3.5 text-rose-400" /> {currentMeeting.attendeesCount} People
                  </div>
                  <div className="h-4 w-px bg-zinc-700 hidden sm:block" />
                  <div className="flex items-center gap-1 text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-rose-400" /> {currentMeeting.startTime} – {currentMeeting.endTime}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between text-[11px] font-medium text-zinc-400 mb-1">
                    <span>Progress (62% Elapsed)</span>
                    <span className="text-rose-400 font-bold">22m remaining</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full w-[62%] transition-all duration-500" />
                  </div>
                </div>
              </div>
            )}

            {roomStatus === "starting_soon" && (
              <div className="my-auto py-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                  Upcoming Reserved Meeting
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
                  Executive Q3 Strategy & OKRs
                </h2>
                <p className="text-xs text-zinc-300 mt-1">
                  Host: <span className="font-semibold text-white">Sarah Jenkins</span> • Starts at 11:30 AM
                </p>

                <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold text-amber-200 text-xs">Check-in Pending</div>
                      <div className="text-[10px] text-amber-400/80">
                        Tap Check-In upon arrival to prevent release.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckedIn(true);
                      setShowToast("✅ Check-in verified! Welcome.");
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow active:scale-95 transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[40px]"
                  >
                    {isCheckedIn ? "Checked In ✓" : "Check In Now"}
                  </button>
                </div>
              </div>
            )}

            {roomStatus === "private" && (
              <div className="my-auto py-1">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <Shield className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Restricted Access</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Confidential Session
                </h2>
                <p className="text-xs text-zinc-300 mt-1">
                  Meeting details masked for privacy. Door lock active.
                </p>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="shrink-0 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
            {roomStatus === "available" && (
              <>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(true)}
                  className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[46px] ${statusTheme.buttonBg}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Specific Time</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNearbyModal(true)}
                  className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer touch-manipulation pointer-events-auto min-h-[46px]"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Other Rooms</span>
                </button>
              </>
            )}

            {roomStatus === "occupied" && (
              <>
                <button
                  type="button"
                  onClick={() => setShowExtendModal(true)}
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-zinc-700 transition-all active:scale-95 cursor-pointer touch-manipulation pointer-events-auto min-h-[44px]"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Extend (+15m)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEndModal(true)}
                  className="py-2.5 px-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer touch-manipulation pointer-events-auto min-h-[44px]"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>End Early</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNearbyModal(true)}
                  className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs flex items-center gap-1 transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[44px]"
                  title="Find Nearby Rooms"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Nearby</span>
                </button>
              </>
            )}

            {roomStatus === "starting_soon" && (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickBook(10)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-zinc-700 transition-all active:scale-95 cursor-pointer touch-manipulation pointer-events-auto min-h-[44px]"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick 5-min Huddle</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNearbyModal(true)}
                  className="py-2.5 px-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer touch-manipulation pointer-events-auto min-h-[44px]"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Find Free Room</span>
                </button>
              </>
            )}

            {roomStatus === "private" && (
              <button
                type="button"
                onClick={() => handleSelectState("available")}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 border border-zinc-700 transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[44px]"
              >
                <span>Release Private Lock (Admin Override)</span>
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SCHEDULE & AMENITIES */}
        <div className="lg:col-span-5 h-full flex flex-col gap-2 min-h-0 overflow-hidden">
          {/* Today's Schedule Card */}
          <div className="bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-2xl rounded-2xl p-3.5 shadow-lg flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 shrink-0">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">Today's Schedule</h3>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                {schedule.length} Sessions
              </span>
            </div>

            {/* Scrollable Schedule Items */}
            <div className="mt-2 space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1">
              {schedule.map((meeting) => {
                const isCompleted = meeting.status === "completed";
                const isCurrent = meeting.status === "current" && roomStatus === "occupied";
                return (
                  <div
                    key={meeting.id}
                    className={`p-2.5 rounded-xl border transition-all duration-150 relative ${
                      isCurrent
                        ? "bg-rose-950/40 border-rose-500/40 shadow-sm"
                        : isCompleted
                        ? "bg-zinc-950/30 border-zinc-900/80 opacity-50"
                        : "bg-zinc-950/60 border-zinc-800/70 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span
                        className={`font-mono font-semibold ${
                          isCurrent ? "text-rose-400 font-bold" : "text-zinc-400"
                        }`}
                      >
                        {meeting.startTime} – {meeting.endTime}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          isCurrent
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : isCompleted
                            ? "bg-zinc-800 text-zinc-500"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {isCurrent ? "In Progress" : isCompleted ? "Done" : "Upcoming"}
                      </span>
                    </div>

                    <div className="mt-1 font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                      {meeting.isPrivate ? "🔒 Confidential Session" : meeting.title}
                    </div>

                    <div className="mt-0.5 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="truncate">Host: {meeting.host}</span>
                      <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <Users className="w-3 h-3" /> {meeting.attendeesCount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Amenities & QR Pass Bar */}
          <div className="shrink-0 grid grid-cols-2 gap-2">
            {/* Amenities */}
            <div className="bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-xl rounded-xl p-2.5 shadow flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" /> Equipment
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {currentRoom.amenities.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50 text-[10px] text-zinc-300 font-medium"
                    >
                      <Icon className="w-2.5 h-2.5 text-zinc-400" />
                      {item.name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* QR Mobile Pass Widget */}
            <div
              onClick={() => setShowQrModal(true)}
              className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl p-2.5 shadow flex items-center justify-between cursor-pointer active:scale-95 touch-manipulation pointer-events-auto group"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Mobile Pass
                </span>
                <p className="text-xs font-semibold text-white mt-0.5">Scan to Book</p>
                <span className="text-[9px] text-zinc-400">Sync Calendar</span>
              </div>
              <div className="w-9 h-9 bg-white rounded-lg p-0.5 shadow group-hover:rotate-3 transition-transform shrink-0 flex items-center justify-center">
                <QrCode className="w-8 h-8 text-zinc-950" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================= BOTTOM BAR ======================= */}
      <footer className="shrink-0 relative z-20 pt-2 pb-1 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs text-zinc-400">
        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tap buttons in header (🟢 Free / 🔴 In Use / 🟡 Soon / 🔒 Private) to change state</span>
        </div>

        {/* Room Switcher Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-zinc-400 font-medium">Room:</span>
          <select
            value={currentRoom.id}
            onChange={(e) => {
              const r = ROOMS.find((rm) => rm.id === e.target.value);
              if (r) {
                setCurrentRoom(r);
                setShowToast(`📍 Display: ${r.name}`);
              }
            }}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer touch-manipulation pointer-events-auto min-h-[36px]"
          >
            {ROOMS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.code})
              </option>
            ))}
          </select>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* =========================== MODALS / DRAWERS ============================ */}
      {/* ========================================================================= */}

      {/* 1. CUSTOM BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-150 pointer-events-auto">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700/80 rounded-2xl p-5 md:p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer touch-manipulation pointer-events-auto"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reserve {currentRoom.name}</h3>
                <p className="text-[11px] text-zinc-400">Instant walk-up room reservation</p>
              </div>
            </div>

            <form onSubmit={handleCustomBookSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  required
                  value={bookingTitle}
                  onChange={(e) => setBookingTitle(e.target.value)}
                  placeholder="e.g. Design Review, Client Call"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-xs font-medium pointer-events-auto"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Host / Organizer
                </label>
                <input
                  type="text"
                  required
                  value={bookingHost}
                  onChange={(e) => setBookingHost(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-xs font-medium pointer-events-auto"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Select Duration
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[15, 30, 45, 60].map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setBookingDuration(d)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[38px] ${
                        bookingDuration === d
                          ? "bg-emerald-500 text-zinc-950 border-emerald-400 shadow"
                          : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-semibold text-zinc-200">Confidential Session</span>
                </div>
                <input
                  type="checkbox"
                  checked={isBookingPrivate}
                  onChange={(e) => setIsBookingPrivate(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded cursor-pointer pointer-events-auto"
                />
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[42px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow active:scale-95 transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[42px]"
                >
                  Confirm & Lock Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. FIND NEARBY ROOMS MODAL */}
      {showNearbyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-150 pointer-events-auto">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-2xl p-5 md:p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowNearbyModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer touch-manipulation pointer-events-auto"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Nearby Available Rooms</h3>
                <p className="text-[11px] text-zinc-400">Available meeting spaces on this floor</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {ROOMS.map((r) => {
                const isSelected = r.id === currentRoom.id;
                return (
                  <div
                    key={r.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-indigo-950/40 border-indigo-500/40"
                        : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs sm:text-sm">{r.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {r.code}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Free
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-2">
                        <span>{r.floor}</span>
                        <span>•</span>
                        <span>{r.capacity} Seats</span>
                        <span>•</span>
                        <span>{r.temp}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentRoom(r);
                        setRoomStatus("available");
                        setShowNearbyModal(false);
                        setShowToast(`🎯 Display: ${r.name}`);
                      }}
                      className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-all active:scale-95 cursor-pointer touch-manipulation pointer-events-auto min-h-[38px]"
                    >
                      {isSelected ? "Current" : "Switch Room →"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. MOBILE COMPANION QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-150 pointer-events-auto">
          <div className="w-full max-w-xs bg-zinc-900 border border-zinc-700/80 rounded-2xl p-5 text-center shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer touch-manipulation pointer-events-auto"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white mt-2">Scan to Connect</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Point camera to sync or book {currentRoom.name}.
            </p>

            <div className="my-4 p-3 bg-white rounded-xl inline-block shadow-lg">
              <svg viewBox="0 0 100 100" className="w-36 h-36 fill-zinc-950" shapeRendering="crispEdges">
                <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                <rect x="35" y="10" width="5" height="15" />
                <rect x="45" y="5" width="15" height="5" />
                <rect x="45" y="15" width="5" height="15" />
                <rect x="55" y="20" width="10" height="5" />
                <rect x="35" y="35" width="10" height="10" />
                <rect x="50" y="35" width="15" height="5" />
                <rect x="70" y="35" width="10" height="10" />
                <rect x="85" y="35" width="10" height="5" />
                <rect x="10" y="35" width="15" height="5" />
                <rect x="10" y="45" width="5" height="15" />
                <rect x="20" y="50" width="10" height="10" />
                <rect x="35" y="50" width="15" height="5" />
                <rect x="45" y="60" width="10" height="15" />
                <rect x="60" y="50" width="15" height="10" />
                <rect x="80" y="50" width="15" height="5" />
                <rect x="80" y="60" width="5" height="15" />
                <rect x="70" y="70" width="10" height="5" />
                <rect x="65" y="80" width="15" height="15" />
                <rect x="85" y="85" width="10" height="10" />
                <rect x="35" y="75" width="10" height="15" />
                <rect x="50" y="80" width="5" height="10" />
              </svg>
            </div>

            <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              PIN: <span className="font-bold text-white">884-291</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. END EARLY MODAL */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-150 pointer-events-auto">
          <div className="w-full max-w-xs bg-zinc-900 border border-zinc-700/80 rounded-2xl p-5 text-center shadow-2xl relative">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white mt-2">End Meeting Early?</h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              Releases <span className="text-white font-semibold">{currentRoom.name}</span> immediately for others.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="flex-1 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[40px]"
              >
                Keep Room
              </button>
              <button
                type="button"
                onClick={handleEndMeetingEarly}
                className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow active:scale-95 transition-all cursor-pointer touch-manipulation pointer-events-auto min-h-[40px]"
              >
                Yes, End Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. EXTEND MEETING MODAL */}
      {showExtendModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-150 pointer-events-auto">
          <div className="w-full max-w-xs bg-zinc-900 border border-zinc-700/80 rounded-2xl p-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowExtendModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer touch-manipulation pointer-events-auto"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Plus className="w-4 h-4" />
            </div>

            <h3 className="text-base font-bold text-white mt-2">Extend Session</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Next meeting in 45 mins. Choose duration:
            </p>

            <div className="my-4 grid grid-cols-2 gap-2">
              {[15, 30].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => handleExtendMeeting(m)}
                  className="py-3 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer touch-manipulation pointer-events-auto min-h-[44px]"
                >
                  +{m} Mins
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowExtendModal(false)}
              className="w-full py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white text-[11px] font-semibold cursor-pointer touch-manipulation pointer-events-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

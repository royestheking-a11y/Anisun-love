import React, { useEffect, useState } from "react";
import { Outlet, Navigate, NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import { DataProvider } from "./DataContext";
import { Home, BookHeart, Image, History, MessageCircleHeart, Frown, SmilePlus, Timer, Lock, Gamepad2, LogOut, Menu, X, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const AppLayout = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback failed:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Our Story", path: "/story", icon: <BookHeart size={18} /> },
    { name: "Gallery", path: "/gallery", icon: <Image size={18} /> },
    { name: "Memories", path: "/memories", icon: <History size={18} /> },
    { name: "Moods", path: "/moods", icon: <SmilePlus size={18} /> },
    { name: "Complaints", path: "/complaints", icon: <Frown size={18} /> },
    { name: "Love Notes", path: "/messages", icon: <MessageCircleHeart size={18} /> },
    { name: "Couple Quiz", path: "/quiz", icon: <Gamepad2 size={18} /> },
    { name: "Secret Vault", path: "/vault", icon: <Lock size={18} /> },
  ];

  return (
    <DataProvider>
      <div className="min-h-screen bg-[#FFFFFF] text-[#4B2E2E] flex flex-col lg:flex-row font-sans selection:bg-[#8B5E3C] selection:text-white">
      {/* Mobile Navbar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border-b border-[#F0EBE6] z-50 sticky top-0">
        <h1 className="text-2xl font-serif text-[#4B2E2E] tracking-tight">ANISUN</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[#4B2E2E]">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#F0EBE6]">
                <h1 className="text-3xl font-serif text-[#4B2E2E]">ANISUN</h1>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#4B2E2E] hover:bg-[#F9F7F5] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        isActive 
                        ? "bg-[#F9F7F5] text-[#C9A227] font-semibold" 
                        : "text-[#8B5E3C] hover:bg-[#F9F7F5]/50"
                      }`
                    }
                  >
                    <div>
                      {item.icon}
                    </div>
                    <span className="text-lg tracking-wide">{item.name}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-[#F0EBE6]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 text-[#8B5E3C] hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
                >
                  <LogOut size={20} />
                  <span className="text-lg font-medium tracking-wide">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 flex-col bg-[#FAFAFA] border-r border-[#F0EBE6] sticky top-0 h-screen py-8 px-6 shadow-[4px_0_24px_rgba(75,46,46,0.02)] z-40 overflow-y-auto scrollbar-hide">
        <div className="mb-10 text-center flex-shrink-0">
          <h1 className="text-4xl font-serif text-[#4B2E2E] tracking-tight mb-2">ANISUN</h1>
          <p className="text-[#8B5E3C] text-[10px] uppercase tracking-[0.3em] font-semibold">The Love Book</p>
          <div className="w-8 h-[1px] bg-[#C9A227] mx-auto mt-4" />
        </div>

        <nav className="flex-1 flex flex-col gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-medium tracking-wide ${
                  isActive 
                  ? "bg-white text-[#4B2E2E] shadow-[0_4px_15px_rgba(75,46,46,0.05)] border border-[#F0EBE6]" 
                  : "text-[#8B5E3C] hover:bg-white/50 hover:text-[#4B2E2E]"
                }`
              }
            >
              <div>
                {item.icon}
              </div>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-4 border-t border-[#F0EBE6] flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[#8B5E3C] hover:bg-red-50 hover:text-red-600 transition-all text-left group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-wide">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-h-[calc(100vh-73px)] lg:min-h-screen relative overflow-x-hidden pb-24 lg:pb-0 bg-[#FAFAFA]">
        <Outlet />
      </main>

      {/* Floating Music Player */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 flex items-center bg-white/90 backdrop-blur-xl p-2 pr-6 rounded-full shadow-[0_20px_40px_rgba(75,46,46,0.15)] border border-[#F0EBE6]"
      >
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-[#4B2E2E] text-[#C9A227] rounded-full hover:scale-105 transition-transform shadow-md"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
        </button>
        <div className="ml-4 flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-[#4B2E2E]">Our Track</span>
            {isPlaying && (
              <div className="flex gap-[2px] items-end h-3">
                <motion.div animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-[#C9A227] rounded-full" />
                <motion.div animate={{ height: ["12px", "4px", "12px"] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-[#C9A227] rounded-full" />
                <motion.div animate={{ height: ["6px", "10px", "6px"] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-[#C9A227] rounded-full" />
              </div>
            )}
          </div>
          <span className="text-xs lg:text-sm font-serif text-[#8B5E3C] italic">Forever - Anisun</span>
        </div>
        <audio ref={audioRef} src="/Forever_In_Bloom.mp3" loop />
      </motion.div>
    </div>
    </DataProvider>
  );
};
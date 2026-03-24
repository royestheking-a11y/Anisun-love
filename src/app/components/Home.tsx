import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { differenceInDays, differenceInMonths, differenceInYears, differenceInSeconds, parseISO } from "date-fns";
import { Heart, CalendarHeart, Clock, Star, PartyPopper, Play, Pause, Volume2, VolumeX, Edit2, Camera, Loader2 } from "lucide-react";
import { useData } from "./DataContext";
import axios from "axios";

const startDate = new Date("2025-09-13");

export const Home = () => {
  const { getConfig, updateConfig } = useData();
  const [heroMedia, setHeroMedia] = useState<{ url: string, type: 'video' | 'image' }>({
    url: "https://assets.mixkit.co/videos/preview/mixkit-holding-hands-in-a-field-of-wheat-45814-large.mp4",
    type: 'video'
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [days, setDays] = useState(0);
  const [months, setMonths] = useState(0);
  const [years, setYears] = useState(0);

  const [annivDays, setAnnivDays] = useState(0);
  const [annivHours, setAnnivHours] = useState(0);
  const [annivMinutes, setAnnivMinutes] = useState(0);
  const [annivSeconds, setAnnivSeconds] = useState(0);

  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<any>(null);

  const handleVideoTap = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    // Total together
    const updateTotalTogether = () => {
      const today = new Date();
      
      const y = differenceInYears(today, startDate);
      const m = differenceInMonths(today, startDate) % 12;
      
      // Calculate remaining days after Y and M
      const tempDate = new Date(startDate);
      tempDate.setFullYear(startDate.getFullYear() + y);
      tempDate.setMonth(startDate.getMonth() + m);
      const d = differenceInDays(today, tempDate);

      setYears(y);
      setMonths(m);
      setDays(d);
    };

    updateTotalTogether();

    // Next Anniversary Countdown
    const updateCountdown = () => {
      const now = new Date();
      let nextAnniv = new Date(now.getFullYear(), 8, 13); // Sept 13 (Month 8 is Sept)
      if (now > nextAnniv) {
        nextAnniv = new Date(now.getFullYear() + 1, 8, 13);
      }

      const diffSecs = differenceInSeconds(nextAnniv, now);
      
      const d = Math.floor(diffSecs / (3600 * 24));
      const h = Math.floor((diffSecs % (3600 * 24)) / 3600);
      const m = Math.floor((diffSecs % 3600) / 60);
      const s = diffSecs % 60;

      setAnnivDays(d);
      setAnnivHours(h);
      setAnnivMinutes(m);
      setAnnivSeconds(s);
    };

    const updateIntervals = () => {
      updateCountdown();
      updateTotalTogether();
    };

    updateIntervals();
    const interval = setInterval(updateIntervals, 1000);

    const fetchHero = async () => {
      const saved = await getConfig('heroMedia');
      if (saved) setHeroMedia(saved);
    };
    fetchHero();

    return () => clearInterval(interval);
  }, []);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "anisun");

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/dgxprxfpc/upload`, formData);
      const newMedia = {
        url: res.data.secure_url,
        type: res.data.resource_type === 'video' ? 'video' : 'image'
      };
      setHeroMedia(newMedia as any);
      await updateConfig('heroMedia', newMedia);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full min-h-full bg-[#FAFAFA] flex flex-col items-center">
      {/* Premium Video Box Hero */}
      <div className="w-full flex flex-col items-center justify-center pt-8 pb-12 md:pt-16 md:pb-24 px-4 md:px-8 bg-gradient-to-b from-[#4B2E2E] to-[#FAFAFA] relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-[#C9A227] rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-[#C9A227] rounded-full blur-[120px] opacity-20" />

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="z-10 w-full max-w-5xl bg-[#FAFAFA] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(75,46,46,0.3)] md:shadow-[0_30px_80px_rgba(75,46,46,0.3)] border-2 border-[#C9A227]/30 flex flex-col group/hero relative"
        >
          {/* Edit Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-4 right-4 z-[30] p-3 bg-black/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover/hero:opacity-100 transition-all border border-white/20 hover:bg-[#C9A227] hover:scale-110"
          >
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleHeroUpload} />

          {/* Video Container */}
          <div 
            className="w-full relative bg-black aspect-video flex overflow-hidden cursor-pointer"
            onClick={handleVideoTap}
          >
            {heroMedia.type === 'video' ? (
              <video
                ref={videoRef}
                src={heroMedia.url}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
                autoPlay
                loop
                muted={isMuted}
                playsInline
              />
            ) : (
              <img src={heroMedia.url} className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Hero" />
            )}
            
            {/* Custom Controls Overlay */}
            {heroMedia.type === 'video' && (
              <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center gap-4 md:gap-6 ${showControls ? "opacity-100" : "opacity-0 md:group-hover/hero:opacity-100"}`}>
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 hover:bg-white/30 hover:scale-105 transition-all shadow-lg"
                >
                  {isPlaying ? <Pause className="fill-current w-5 h-5 md:w-7 md:h-7" /> : <Play className="fill-current ml-1 w-5 h-5 md:w-7 md:h-7" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 hover:bg-white/30 hover:scale-105 transition-all absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 shadow-lg"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>
            )}
            {!isPlaying && (
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-xl">
                   <Play className="fill-current ml-2 w-8 h-8 md:w-10 md:h-10" />
                 </div>
               </div>
            )}
            {isPlaying && isMuted && (
              <div className="absolute top-4 left-4 md:top-6 md:left-6 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] md:text-xs font-sans tracking-widest uppercase flex items-center gap-1.5 md:gap-2 pointer-events-none shadow-md">
                <VolumeX className="w-3 h-3 md:w-3.5 md:h-3.5" /> Tap to unmute
              </div>
            )}
          </div>

          {/* Poem Container */}
          <div className="w-full p-6 md:p-12 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#FAFAFA] to-[#F0EBE6] relative">
            <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#C9A227]/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#8B5E3C]/5 to-transparent pointer-events-none" />
            
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-[#C9A227] mb-4 md:mb-6 opacity-80" />
            
            <div className="font-serif text-[#4B2E2E] space-y-4 md:space-y-6 relative z-10 text-lg md:text-2xl leading-relaxed md:leading-relaxed max-w-2xl mx-auto px-2">
              <p className="italic font-medium">
                "Sunny loves Anisha, that’s the truth,<br />
                From one small ride, we found our route.<br />
                Laughing, dreaming, hand in hand,<br />
                Building love we always planned."
              </p>
              <p className="italic font-medium text-[#8B5E3C]">
                "Sunny and Anisha, heart to heart,<br />
                One small meeting — a lifelong start."
              </p>
            </div>
            
            <div className="mt-8 md:mt-10 flex items-center gap-3 md:gap-4">
              <div className="h-[1px] w-8 md:w-12 bg-[#C9A227]" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#8B5E3C] font-semibold">Our Story</span>
              <div className="h-[1px] w-8 md:w-12 bg-[#C9A227]" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pb-12 z-20 relative flex flex-col gap-6 md:gap-8">
        {/* Anniversary Counter (Total Together) */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 shadow-[0_20px_40px_rgba(75,46,46,0.06)] md:shadow-[0_30px_60px_rgba(75,46,46,0.08)] border border-[#F0EBE6] text-center"
        >
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="p-3 md:p-4 bg-[#F9F7F5] rounded-full text-[#C9A227] shadow-inner">
              <Heart className="w-6 h-6 md:w-8 md:h-8 animate-pulse fill-current" />
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-serif text-[#4B2E2E] mb-8 md:mb-12">Together For</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 lg:gap-12">
            <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-[#FAFAFA] rounded-2xl md:rounded-3xl border border-[#F0EBE6] group hover:border-[#8B5E3C] transition-colors">
              <Clock className="w-8 h-8 md:w-10 md:h-10 text-[#8B5E3C] mb-3 md:mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
              <div className="text-4xl md:text-5xl font-serif text-[#4B2E2E] mb-1 md:mb-2">{years}</div>
              <div className="text-[#8B5E3C] uppercase tracking-[0.2em] text-[10px] md:text-sm">Years</div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-[#FAFAFA] rounded-2xl md:rounded-3xl border border-[#F0EBE6] group hover:border-[#8B5E3C] transition-colors">
              <Star className="w-8 h-8 md:w-10 md:h-10 text-[#C9A227] mb-3 md:mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
              <div className="text-4xl md:text-5xl font-serif text-[#4B2E2E] mb-1 md:mb-2">{months}</div>
              <div className="text-[#8B5E3C] uppercase tracking-[0.2em] text-[10px] md:text-sm">Months</div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-[#FAFAFA] rounded-2xl md:rounded-3xl border border-[#F0EBE6] group hover:border-[#8B5E3C] transition-colors">
              <CalendarHeart className="w-8 h-8 md:w-10 md:h-10 text-[#8B5E3C] mb-3 md:mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
              <div className="text-4xl md:text-5xl font-serif text-[#4B2E2E] mb-1 md:mb-2">{days}</div>
              <div className="text-[#8B5E3C] uppercase tracking-[0.2em] text-[10px] md:text-sm">Days</div>
            </div>
          </div>
        </motion.div>

        {/* Next Anniversary Countdown */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="bg-gradient-to-br from-[#4B2E2E] to-[#3A2222] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 shadow-2xl border border-[#C9A227]/30 text-center relative overflow-hidden"
        >
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-[#C9A227] rounded-full blur-[100px] opacity-20 pointer-events-none" />
          
          <div className="flex justify-center mb-4 md:mb-6 relative z-10">
            <div className="p-3 md:p-4 bg-white/10 backdrop-blur-sm rounded-full text-[#C9A227]">
              <PartyPopper className="w-6 h-6 md:w-8 md:h-8" />
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-serif text-[#E5DFD3] mb-1 md:mb-2 relative z-10">Next Anniversary</h2>
          <p className="text-[#C9A227] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm font-semibold mb-6 md:mb-10 relative z-10">September 13th</p>
          
          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 relative z-10 w-full max-w-lg mx-auto">
            <div className="flex flex-col items-center justify-center aspect-square md:w-32 md:h-32 bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10 p-2 md:p-0">
              <div className="text-xl sm:text-3xl md:text-5xl font-serif text-white mb-0.5 md:mb-1">{annivDays}</div>
              <div className="text-[#C9A227] uppercase tracking-widest text-[8px] md:text-[10px] lg:text-xs">Days</div>
            </div>
            
            <div className="flex flex-col items-center justify-center aspect-square md:w-32 md:h-32 bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10 p-2 md:p-0">
              <div className="text-xl sm:text-3xl md:text-5xl font-serif text-white mb-0.5 md:mb-1">{annivHours}</div>
              <div className="text-[#C9A227] uppercase tracking-widest text-[8px] md:text-[10px] lg:text-xs">Hours</div>
            </div>

            <div className="flex flex-col items-center justify-center aspect-square md:w-32 md:h-32 bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10 p-2 md:p-0">
              <div className="text-xl sm:text-3xl md:text-5xl font-serif text-white mb-0.5 md:mb-1">{annivMinutes}</div>
              <div className="text-[#C9A227] uppercase tracking-widest text-[8px] md:text-[10px] lg:text-xs">Mins</div>
            </div>

            <div className="flex flex-col items-center justify-center aspect-square md:w-32 md:h-32 bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10 p-2 md:p-0">
              <div className="text-xl sm:text-3xl md:text-5xl font-serif text-white mb-0.5 md:mb-1">{annivSeconds}</div>
              <div className="text-[#C9A227] uppercase tracking-widest text-[8px] md:text-[10px] lg:text-xs">Secs</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
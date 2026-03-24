import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useData } from "./DataContext";
import { BookHeart, Plus, X, Image as ImageIcon, Loader2, Upload, CheckCircle2, Heart, Sparkles, ChevronRight, Bus, Ticket, Phone } from "lucide-react";
import axios from "axios";

const FIXED_MOMENTS = [
  {
    _id: "fixed-1",
    title: "We Met at the Bus Counter",
    description: "It was just another day,\nbut destiny had different plans.",
    imageUrl: "https://res.cloudinary.com/dgxprxfpc/image/upload/v1774344314/wmgtozbeag4fict1nuxx.jpg"
  },
  {
    _id: "fixed-2",
    title: "First Eye Contact",
    description: "We looked at each other,\nand something felt different.",
    imageUrl: "https://res.cloudinary.com/dgxprxfpc/image/upload/v1774344700/wly4rvi3czhfz1i7obee.jpg"
  },
  {
    _id: "fixed-3",
    title: "Same Bus Journey",
    description: "She sat in front of me,\nand I kept looking at her.",
    imageUrl: "https://res.cloudinary.com/dgxprxfpc/image/upload/v1774344321/ojrm4gud7az7owelkbxz.jpg"
  },
  {
    _id: "fixed-4",
    title: "The Ticket Moment",
    description: "No pen. No paper.\nOnly courage.\n\nSo I threw my number with the ticket.",
    imageUrl: "https://res.cloudinary.com/dgxprxfpc/image/upload/v1774344711/w961ov7ibp5dpfwlb6vy.jpg"
  },
  {
    _id: "fixed-5",
    title: "The Call",
    description: "Then something magical happened.\n\nMy phone rang.\n\nIt was her.",
    imageUrl: "https://res.cloudinary.com/dgxprxfpc/image/upload/v1774344708/l50ipkoz8mgxxabsnv8p.jpg"
  },
  {
    _id: "fixed-6",
    title: "First Meeting",
    description: "We finally met again,\nthis time with smiles.",
    imageUrl: "https://res.cloudinary.com/dgxprxfpc/image/upload/v1774344703/tnakme7uudwrvv2c4mrj.jpg"
  },
  {
    _id: "fixed-7",
    title: "5 Months Together",
    description: "Now it's been 5 beautiful months\nof love, trust, and memories.",
    imageUrl: "https://res.cloudinary.com/dgxprxfpc/image/upload/v1774344303/qdifqrcgoxjdxzngqxwi.jpg"
  }
];

export const Story = () => {
  const { storyMoments, addStoryMoment, loading } = useData();
  const allMoments = [...FIXED_MOMENTS, ...storyMoments];
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const busX = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], ["-20vw", "40vw", "80vw", "120vw"]);
  
  const ticketY = useTransform(scrollYProgress, [0.3, 0.5, 0.6], ["0vh", "-30vh", "-60vh"]);
  const ticketX = useTransform(scrollYProgress, [0.3, 0.5, 0.6], ["0vw", "20vw", "40vw"]);
  const ticketRotate = useTransform(scrollYProgress, [0.3, 0.6], [0, 360]);

  const [isRinging, setIsRinging] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "anisun");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dgxprxfpc/image/upload`,
        formData
      );
      setImageUrl(res.data.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    await addStoryMoment({
      title,
      description,
      imageUrl
    });
    setTitle(""); setDescription(""); setImageUrl(""); setIsAdding(false);
  };

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest > 0.65 && latest < 0.75) {
        setIsRinging(true);
      } else {
        setIsRinging(false);
      }
    });
  }, [scrollYProgress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4B2E2E]"></div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-[#FAFAFA] relative selection:bg-[#8B5E3C] selection:text-white overflow-hidden">
      {/* Decorative Fixed Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          style={{ top: backgroundY }}
          className="absolute -right-[20%] w-[50%] h-[50%] bg-[#C9A227] rounded-full blur-[150px] opacity-[0.05]" 
        />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-[#8B5E3C] rounded-full blur-[120px] opacity-[0.03]" />
      </div>

      {/* Floating Interactive Elements */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        {/* The Bus */}
        <motion.div 
          style={{ left: busX, top: "20%" }} 
          className="absolute text-[#4B2E2E] opacity-10"
        >
          <Bus size={120} />
        </motion.div>

        {/* The Ticket */}
        <motion.div
          style={{ x: ticketX, y: ticketY, rotate: ticketRotate, bottom: "20%", left: "10%" }}
          className="absolute text-[#C9A227] drop-shadow-xl"
        >
          <Ticket size={48} className="opacity-80" />
        </motion.div>
        
        {/* Phone Ringing Effect */}
        <AnimatePresence>
          {isRinging && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-[#4B2E2E]"
            >
              <div className="relative">
                <Phone size={80} className="animate-bounce" />
                <motion.div 
                  animate={{ scale: [1, 2, 3], opacity: [0.8, 0, 0] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 border-4 border-[#C9A227] rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0, 0] }} 
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                  className="absolute inset-0 border-4 border-[#C9A227] rounded-full"
                />
              </div>
              <div className="mt-8 text-2xl font-serif text-[#C9A227] animate-pulse bg-white/80 px-6 py-2 rounded-full backdrop-blur-sm">
                Incoming Call...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Intro Header */}
      <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center max-w-3xl"
        >
          <div className="mb-6 flex justify-center">
            <Heart size={40} className="text-[#C9A227] animate-pulse drop-shadow-lg" fill="currentColor" />
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#4B2E2E] mb-8 leading-tight tracking-tight">
            The Pages of <br/> <span className="italic font-light">Our Story</span>
          </h1>
          <p className="text-[#8B5E3C] text-lg md:text-xl uppercase tracking-[0.3em] font-light mb-12">
            Keep scrolling to relive the moments
          </p>
          
          <button 
            onClick={() => setIsAdding(true)}
            className="px-8 py-4 bg-[#4B2E2E] text-[#C9A227] rounded-full font-bold tracking-widest uppercase hover:bg-[#3A2222] transition-all shadow-xl flex items-center gap-3 mx-auto"
          >
            <Plus size={20} /> Write a New Chapter
          </button>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-20 flex justify-center"
          >
            <div className="w-px h-24 bg-gradient-to-b from-[#8B5E3C] to-transparent" />
          </motion.div>
        </motion.div>
      </div>

      {/* Chapters */}
      <div className="relative z-10 pb-32">
        {allMoments.map((moment, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={moment._id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 1 }}
              className="min-h-screen flex items-center justify-center px-4 md:px-12 py-20 sticky top-0"
              style={{ zIndex: index + 10 }}
            >
              {/* Card Container */}
              <div className={`w-full max-w-6xl flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(75,46,46,0.08)] overflow-hidden border border-[#F0EBE6]`}>
                
                {/* Image Section */}
                <div className="w-full md:w-1/2 h-[40vh] md:h-[70vh] relative overflow-hidden group">
                  {moment.imageUrl ? (
                    <>
                      <motion.img
                        initial={{ scale: 1.2 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 2 }}
                        src={moment.imageUrl}
                        alt={moment.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[#4B2E2E]/10 group-hover:bg-transparent transition-colors duration-700" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-[#F9F7F5] flex items-center justify-center p-12 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#8B5E3C 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                      <Heart size={80} className="text-[#E5DFD3]" />
                    </div>
                  )}
                </div>

                {/* Text Section */}
                <div className="w-full md:w-1/2 p-10 md:p-20 flex flex-col justify-center relative bg-white">
                  <div className="absolute top-10 right-10 text-[8rem] font-serif text-[#F0EBE6] leading-none select-none opacity-50">
                    0{index + 1}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="relative z-10"
                  >
                    <div className="text-[#C9A227] uppercase tracking-[0.2em] text-sm font-semibold mb-6">Chapter {index + 1}</div>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#4B2E2E] mb-8 leading-tight">
                      {moment.title}
                    </h2>
                    <p className="text-[#8B5E3C] text-lg leading-relaxed whitespace-pre-line font-light text-justify">
                      {moment.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Footer Ending */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="min-h-[50vh] flex flex-col items-center justify-center text-center pb-20 relative z-10 px-4"
      >
        <h3 className="text-3xl md:text-5xl font-serif text-[#4B2E2E] mb-6 italic">And the story continues...</h3>
        <p className="text-[#8B5E3C] uppercase tracking-widest text-sm mb-12">Forever & Always</p>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 border-2 border-[#8B5E3C] text-[#8B5E3C] rounded-full font-bold tracking-widest uppercase hover:bg-[#8B5E3C] hover:text-white transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add Chapter
        </button>
      </motion.div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setIsAdding(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] p-10 w-full max-w-xl shadow-2xl relative border border-[#F0EBE6]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-serif text-[#4B2E2E]">New Chapter</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 text-[#8B5E3C] hover:bg-[#F9F7F5] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#8B5E3C] mb-2">Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Chapter Title"
                    className="w-full px-6 py-4 bg-[#F9F7F5] border border-[#F0EBE6] focus:border-[#C9A227] rounded-2xl outline-none transition-all text-[#4B2E2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#8B5E3C] mb-2">Story Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this moment..."
                    rows={4}
                    className="w-full px-6 py-4 bg-[#F9F7F5] border border-[#F0EBE6] focus:border-[#C9A227] rounded-2xl outline-none transition-all text-[#4B2E2E] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] mb-3">Chapter Cover</label>
                  <label className="flex flex-col items-center justify-center w-full h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer hover:border-[#C9A227]/50 hover:bg-white/10 transition-all duration-500 group overflow-hidden shadow-inner">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-[#C9A227]" size={32} />
                        <span className="text-xs text-white/40 tracking-widest uppercase animate-pulse">Processing...</span>
                      </div>
                    ) : imageUrl ? (
                      <div className="relative w-full h-full group">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                          <CheckCircle2 className="text-white" size={32} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center transition-all duration-500">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/5">
                           <Upload size={20} className="text-[#C9A227]" />
                        </div>
                        <span className="text-xs text-white/40 tracking-[0.2em] uppercase">Select Cover Photo</span>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !title || !description}
                  className="w-full py-5 bg-[#4B2E2E] text-[#C9A227] rounded-2xl font-bold tracking-widest uppercase hover:bg-[#3A2222] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {uploading ? "Writing..." : "Add to Our Story"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
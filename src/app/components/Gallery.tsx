import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useData } from "./DataContext";
import { ImagePlus, Trash2, X, Download, Film, Camera, Loader2, Upload } from "lucide-react";
import axios from "axios";

export const Gallery = () => {
  const { galleryImages, addGalleryImage, deleteGalleryImage, loading: dataLoading } = useData();
  const [filter, setFilter] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImgFile, setNewImgFile] = useState<File | null>(null);
  const [newImgCat, setNewImgCat] = useState<"Our Selfies" | "Trips" | "Special Days" | "Random Moments">("Our Selfies");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["All", "Our Selfies", "Trips", "Special Days", "Random Moments"];
  const filteredImages = filter === "All" ? galleryImages : galleryImages.filter(img => img.category === filter);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImgFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", newImgFile);
      formData.append("upload_preset", "anisun"); // Using the unsigned preset provided

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dgxprxfpc/image/upload",
        formData
      );

      await addGalleryImage({
        url: res.data.secure_url,
        category: newImgCat,
      });

      setNewImgFile(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `anisun-memory-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-[#E5DFD3] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#4B2E2E]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#E5DFD3] py-20 px-4 md:px-12 relative font-sans">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4B2E2E 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left"
          >
            <div className="flex items-center gap-3 mb-4 text-[#8B5E3C]">
              <Film size={24} />
              <span className="uppercase tracking-[0.3em] text-sm font-semibold">The Archives</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-[#4B2E2E] leading-none">
              Captured<br/><span className="italic text-[#C9A227]">Moments</span>
            </h1>
          </motion.div>

          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsAdding(true)}
            className="group flex items-center gap-3 px-8 py-4 bg-[#4B2E2E] text-white rounded-full hover:bg-[#3A2222] transition-all shadow-[0_10px_30px_rgba(75,46,46,0.2)] hover:shadow-[0_15px_40px_rgba(75,46,46,0.3)]"
          >
            <Camera size={20} className="group-hover:rotate-12 transition-transform" /> 
            <span className="font-medium tracking-wide">Develop New Memory</span>
          </motion.button>
        </div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full text-sm tracking-[0.1em] uppercase transition-all duration-300 font-medium ${
                filter === cat 
                ? "bg-[#C9A227] text-white shadow-[0_8px_20px_rgba(201,162,39,0.3)] scale-105" 
                : "bg-white text-[#8B5E3C] hover:bg-[#F9F7F5] shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid (Polaroid Style) */}
        <motion.div layout className="min-h-[50vh]">
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3 }}>
            <Masonry gutter="3rem">
              <AnimatePresence>
                {filteredImages.map((img, index) => {
                  const randomRotation = index % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]";
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5, type: "spring" }}
                      key={img._id}
                      className={`relative group bg-white p-4 pb-12 shadow-[0_15px_35px_rgba(0,0,0,0.07)] cursor-zoom-in transition-all duration-500 hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:scale-[1.02] hover:rotate-0 hover:z-20 ${randomRotation}`}
                      onClick={() => setSelectedImage(img.url)}
                    >
                      {/* Photo Area */}
                      <div className="overflow-hidden bg-[#FAFAFA] aspect-[4/5] relative border border-[#F0EBE6]">
                        <img 
                          src={img.url} 
                          alt={img.category} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter contrast-[0.95] sepia-[0.1]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-[#4B2E2E]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <ImagePlus className="text-white opacity-50 w-12 h-12" />
                        </div>
                      </div>
                      
                      {/* Handwriting Caption Area */}
                      <div className="absolute bottom-4 left-0 w-full text-center px-4 flex justify-between items-center">
                        <span className="font-serif text-xl text-[#4B2E2E] italic truncate pr-2">{img.category}</span>
                        <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDownload(img.url); }}
                            className="p-2 text-[#8B5E3C] hover:text-[#C9A227] transition-colors"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); if(img._id) deleteGalleryImage(img._id); }}
                            className="p-2 text-[#8B5E3C] hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Tape effect top center */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 bg-white/40 backdrop-blur-md rotate-[-3deg] border border-white/50 shadow-sm z-10" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.2) 100%)' }} />
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </Masonry>
          </ResponsiveMasonry>
        </motion.div>

        {filteredImages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <Film size={60} className="mx-auto text-[#8B5E3C]/30 mb-6" />
            <h3 className="text-3xl font-serif text-[#4B2E2E] mb-2">No photos found</h3>
            <p className="text-[#8B5E3C] font-light">Your album in this category is currently empty.</p>
          </motion.div>
        )}

        {/* Cinematic Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-[#1A1A1A] flex items-center justify-center p-4 md:p-12"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-20 right-6 p-4 bg-white/20 backdrop-blur-xl rounded-full text-white shadow-2xl z-[10000] border border-white/30"
                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              >
                <X size={24} />
              </button>
              
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative max-w-5xl w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="Enlarged Memory"
                  className="max-w-full max-h-[85vh] object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] border-8 border-white"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Modal */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-[#2A1C1C]/60 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setIsAdding(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-[#C9A227]" />
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-3xl font-serif text-[#4B2E2E] leading-none mb-1">Add Photo</h3>
                    <p className="text-sm text-[#8B5E3C] uppercase tracking-widest">To the Archives</p>
                  </div>
                  <button onClick={() => setIsAdding(false)} className="p-3 text-[#8B5E3C] hover:bg-[#F9F7F5] rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleUpload} className="space-y-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video bg-white/5 backdrop-blur-sm border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A227]/50 hover:bg-white/10 transition-all duration-500 group relative overflow-hidden shadow-inner"
                  >
                    {newImgFile ? (
                      <div className="w-full h-full p-3 relative group">
                        <img src={URL.createObjectURL(newImgFile)} className="w-full h-full object-cover rounded-2xl shadow-2xl" alt="Preview" />
                        <div className="absolute inset-3 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 rounded-2xl backdrop-blur-[2px]">
                          <Upload size={24} className="text-white mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform" />
                          <p className="text-white text-xs font-bold tracking-widest uppercase">Change Masterpiece</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-[#F0EBE6]">
                          <Upload size={28} className="text-[#8B5E3C]" />
                        </div>
                        <p className="text-[#4B2E2E] font-serif text-lg mb-1">Upload a Memory</p>
                        <p className="text-xs text-[#8B5E3C]/60 tracking-wider">Drag & drop or click to browse</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => setNewImgFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] font-semibold text-[#8B5E3C] mb-2">Category</label>
                    <select
                      value={newImgCat}
                      onChange={(e) => setNewImgCat(e.target.value as any)}
                      className="w-full px-5 py-4 bg-[#FAFAFA] border border-[#F0EBE6] focus:border-[#C9A227] focus:bg-white rounded-xl outline-none transition-all text-[#4B2E2E] appearance-none cursor-pointer"
                    >
                      <option value="Our Selfies">Our Selfies</option>
                      <option value="Trips">Trips</option>
                      <option value="Special Days">Special Days</option>
                      <option value="Random Moments">Random Moments</option>
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!newImgFile || uploading}
                    className={`w-full py-4 mt-4 bg-[#4B2E2E] text-[#C9A227] rounded-xl transition-all font-medium tracking-wide shadow-lg flex items-center justify-center gap-2 ${
                      !newImgFile || uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3A2222] shadow-[#4B2E2E]/20"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Develop Memory"
                    )}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
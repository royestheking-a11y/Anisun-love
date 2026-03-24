import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "./DataContext";
import { MessageSquare, Plus, X, Heart, Send, Loader2, Upload, CheckCircle2, Camera, PenLine } from "lucide-react";
import axios from "axios";

export const Messages = () => {
  const { messages, addMessage } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("Sunny");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "anisun");
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/dgxprxfpc/image/upload`, formData);
      setImageUrl(res.data.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    await addMessage({
      text,
      author,
      date: new Date().toLocaleDateString(),
      imageUrl
    });
    setText("");
    setImageUrl("");
    setIsAdding(false);
  };

  const sortedMessages = [...messages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-full bg-[#FAFAFA] py-16 px-4 md:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-serif text-[#4B2E2E] mb-6 md:mb-0"
          >
            Love Notes
          </motion.h1>

          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#4B2E2E] text-[#C9A227] rounded-xl hover:bg-[#3A2222] transition-colors shadow-lg shadow-[#4B2E2E]/20 font-medium"
          >
            <PenLine size={18} /> Write a Note
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {sortedMessages.map((msg, index) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_rgba(75,46,46,0.05)] border border-[#F0EBE6] relative group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#8B5E3C] bg-[#F9F7F5] px-3 py-1 rounded-full">
                      {new Date(msg.date).toLocaleDateString()}
                    </span>
                    <Heart size={16} className="text-red-400 fill-current opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {msg.imageUrl && (
                    <div className="mb-4 rounded-2xl overflow-hidden border border-[#F0EBE6] shadow-sm">
                      <img src={msg.imageUrl} alt="Note" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <p className="text-[#4B2E2E] font-serif text-lg leading-relaxed italic">"{msg.text}"</p>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="h-[1px] w-4 bg-[#C9A227]" />
                    <span className="text-xs font-bold text-[#8B5E3C] uppercase tracking-widest">— {msg.author}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {sortedMessages.length === 0 && (
          <div className="text-center py-32">
            <p className="text-[#8B5E3C] text-xl font-serif italic">No love notes yet. Write the first one!</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#4B2E2E]/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsAdding(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-xl shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9F7F5] rounded-bl-full -z-10" />
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-3xl font-serif text-[#4B2E2E]">Write Note</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 text-[#8B5E3C] hover:bg-[#F9F7F5] rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAdd} className="space-y-6 relative z-10">
                <div>
                  <textarea
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your heart out..."
                    rows={4}
                    className="w-full px-5 py-4 bg-[#FAFAFA] border border-[#F0EBE6] focus:border-[#C9A227] focus:bg-white rounded-xl outline-none transition-colors text-[#4B2E2E] resize-none"
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-6 py-4 bg-[#F9F7F5] border border-transparent focus:border-[#C9A227] focus:bg-white rounded-xl outline-none transition-colors text-[#4B2E2E] font-serif text-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[#8B5E3C] mb-3">Attach a Memory (Optional)</label>
                  <label className="flex flex-col items-center justify-center w-full h-40 bg-[#FAFAFA] border-2 border-dashed border-[#F0EBE6] rounded-[2rem] cursor-pointer hover:border-[#C9A227]/50 hover:bg-[#FDFBF7] transition-all duration-500 overflow-hidden group shadow-inner">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-[#C9A227]" />
                        <span className="text-[10px] text-[#C9A227] tracking-widest uppercase animate-pulse">Sending...</span>
                      </div>
                    ) : imageUrl ? (
                      <div className="relative w-full h-full group">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                          <CheckCircle2 className="text-white" size={32} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-[#F0EBE6] shadow-sm">
                           <Camera size={20} className="text-[#8B5E3C]" />
                        </div>
                        <span className="text-[10px] text-[#8B5E3C]/40 tracking-widest uppercase">Include a Photo</span>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-4 bg-[#4B2E2E] text-[#C9A227] rounded-xl hover:bg-[#3A2222] transition-colors font-bold tracking-[0.2em] uppercase shadow-lg mt-4 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <Send size={18} /> {uploading ? "Uploading..." : "Send Note"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
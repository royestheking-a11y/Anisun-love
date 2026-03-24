import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Unlock, Image as ImageIcon, FileText, Plus, X, Loader2, Upload, CheckCircle } from "lucide-react";
import { useData } from "./DataContext";
import axios from "axios";

const SECRET_PIN = "0000";

export const SecretVault = () => {
  const { secretData, addSecretItem, loading } = useData();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [type, setType] = useState<"photo" | "note">("photo");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === SECRET_PIN) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPinInput("");
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "anisun"); // Corrected preset

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dgxprxfpc/image/upload`,
        formData
      );
      setContent(res.data.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    await addSecretItem({
      type,
      content,
      date: new Date().toISOString()
    });
    setContent(""); setIsAdding(false);
  };

  if (loading && isUnlocked) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C9A227]" size={48} />
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-full bg-[#1A1A1A] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#2A2A2A] p-10 rounded-[2rem] shadow-2xl border border-white/10 w-full max-w-sm text-center"
        >
          <div className="w-20 h-20 bg-black/30 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
            <Lock size={32} className="text-[#C9A227]" />
          </div>
          <h2 className="text-3xl font-serif text-white mb-2">Secret Vault</h2>
          <p className="text-white/40 text-sm mb-8">Enter PIN to unlock</p>

          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              maxLength={4}
              className={`w-full bg-black/20 border-2 rounded-xl px-4 py-4 text-center text-2xl tracking-[1em] text-white outline-none transition-all ${
                error ? "border-red-500 text-red-500 animate-pulse" : "border-white/10 focus:border-[#C9A227]"
              }`}
            />
            {error && <p className="text-red-400 text-sm mt-4">Incorrect PIN. Try again.</p>}
            
            <button
              type="submit"
              className="w-full mt-8 py-4 bg-[#C9A227] text-black rounded-xl font-bold tracking-widest uppercase hover:bg-white transition-colors"
            >
              Unlock
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#1A1A1A] py-20 px-4 md:px-12 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="flex items-center gap-4">
            <Unlock size={32} className="text-[#C9A227]" />
            <div>
              <h1 className="text-4xl font-serif">The Vault</h1>
              <p className="text-white/40 text-sm tracking-widest uppercase">For our eyes only</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAdding(true)}
              className="px-6 py-3 bg-[#C9A227] text-black rounded-xl hover:bg-white transition-colors font-bold flex items-center gap-2"
            >
              <Plus size={18} /> Add Secret
            </button>
            <button 
              onClick={() => setIsUnlocked(false)}
              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-bold"
            >
              Lock
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {secretData.map(item => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#2A2A2A] rounded-3xl p-6 border border-white/5 shadow-xl"
            >
              {item.type === "photo" ? (
                <div>
                  <div className="flex items-center gap-2 text-white/40 mb-4 text-xs uppercase tracking-widest">
                    <ImageIcon size={14} /> Private Photo
                  </div>
                  <img src={item.content} alt="Secret" className="w-full h-64 object-cover rounded-xl" />
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-2 text-white/40 mb-4 text-xs uppercase tracking-widest">
                    <FileText size={14} /> Private Note
                  </div>
                  <p className="text-white/80 font-serif text-lg leading-relaxed whitespace-pre-wrap flex-1">
                    {item.content}
                  </p>
                </div>
              )}
            </motion.div>
          ))}

          {secretData.length === 0 && (
            <div className="col-span-full text-center py-32 border border-white/10 border-dashed rounded-3xl">
              <Lock size={48} className="mx-auto text-white/20 mb-4" />
              <p className="text-white/50 font-serif text-xl">The vault is currently empty.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsAdding(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#2A2A2A] rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif text-white">Add to Vault</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 text-white/50 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAdd} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#C9A227] mb-2">Type</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => { setType("photo"); setContent(""); }}
                      className={`flex-1 py-3 rounded-xl flex justify-center items-center gap-2 transition-colors ${type === "photo" ? "bg-[#C9A227] text-black" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
                    >
                      <ImageIcon size={18} /> Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => { setType("note"); setContent(""); }}
                      className={`flex-1 py-3 rounded-xl flex justify-center items-center gap-2 transition-colors ${type === "note" ? "bg-[#C9A227] text-black" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
                    >
                      <FileText size={18} /> Secret Note
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#C9A227] mb-2">
                    {type === "photo" ? "Image Upload" : "Note Content"}
                  </label>
                  {type === "photo" ? (
                    <div className="space-y-4">
                       <label className="flex flex-col items-center justify-center w-full h-48 bg-black/20 border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer hover:border-[#C9A227]/50 hover:bg-white/5 transition-all duration-500 group overflow-hidden shadow-inner">
                        {uploading ? (
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="animate-spin text-[#C9A227]" size={32} />
                            <p className="text-[10px] text-[#C9A227] tracking-[0.2em] uppercase animate-pulse">Encrypting...</p>
                          </div>
                        ) : content ? (
                          <div className="relative w-full h-full group">
                            <img src={content} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                              <CheckCircle className="text-white" size={32} />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center transition-all duration-500">
                            <div className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/5 shadow-2xl">
                              <Upload className="text-[#C9A227]" size={24} />
                            </div>
                            <span className="text-[10px] text-white/30 tracking-[0.3em] uppercase">Hide a Memory</span>
                          </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </label>
                    </div>
                  ) : (
                    <textarea
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Your secret message..."
                      rows={5}
                      className="w-full px-5 py-4 bg-black/20 border border-white/10 focus:border-[#C9A227] rounded-xl outline-none transition-colors text-white resize-none"
                    />
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={uploading || !content}
                  className={`w-full py-4 bg-[#C9A227] text-black rounded-xl hover:bg-white transition-colors font-bold tracking-wide mt-4 ${(uploading || !content) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploading ? "Uploading..." : "Lock it away"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
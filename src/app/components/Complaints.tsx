import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "./DataContext";
import { Frown, Plus, X, CheckCircle, AlertCircle, Loader2, Upload } from "lucide-react";
import axios from "axios";

export const Complaints = () => {
  const { complaints, addComplaint, resolveComplaint, loading } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
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
    if (!title || !reason) return;
    await addComplaint({
      title,
      reason,
      date: new Date().toISOString().split('T')[0],
      resolved: false,
      imageUrl
    });
    setTitle("");
    setReason("");
    setImageUrl("");
    setIsAdding(false);
  };

  const activeComplaints = complaints.filter(c => !c.resolved).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const resolvedComplaints = complaints.filter(c => c.resolved).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-full bg-[#FAFAFA] py-20 px-4 md:px-12 relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-serif text-[#4B2E2E] mb-2 flex items-center gap-4 justify-center md:justify-start">
              Why She's Angry <Frown className="text-[#8B5E3C]" size={40} />
            </h1>
            <p className="text-[#8B5E3C] uppercase tracking-widest text-sm font-semibold">
              The "I'm fine" translation manual
            </p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 bg-[#4B2E2E] text-[#C9A227] rounded-xl hover:bg-[#3A2222] transition-colors shadow-lg shadow-[#4B2E2E]/20 font-medium flex items-center gap-2"
          >
            <Plus size={18} /> Log Complaint
          </button>
        </div>

        <div className="space-y-12">
          {/* Active Complaints */}
          <div>
            <h2 className="text-2xl font-serif text-[#4B2E2E] mb-6 flex items-center gap-3">
              <AlertCircle className="text-red-500" /> Currently Angry About
            </h2>
            {activeComplaints.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-[#F0EBE6] text-center shadow-sm">
                <p className="text-[#8B5E3C] font-serif text-lg italic">She's actually fine today! (Or it's a trap)</p>
              </div>
            ) : (
              <div className="grid gap-6">
                <AnimatePresence>
                  {activeComplaints.map(c => (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_10px_30px_rgba(75,46,46,0.04)] border-l-4 border-l-red-400 border-y border-r border-[#F0EBE6] flex flex-col md:flex-row justify-between gap-6 items-start md:items-center"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-serif text-[#4B2E2E]">{c.title}</h3>
                          <span className="text-xs text-[#8B5E3C] bg-[#F9F7F5] px-3 py-1 rounded-full">{c.date}</span>
                        </div>
                        {c.imageUrl && (
                          <div className="mb-4 rounded-xl overflow-hidden border border-[#F0EBE6] max-w-sm">
                            <img src={c.imageUrl} alt="Proof" className="w-full h-40 object-cover" />
                          </div>
                        )}
                        <p className="text-[#4B2E2E]/80 font-light">{c.reason}</p>
                      </div>
                      <button
                        onClick={() => { if(c._id) resolveComplaint(c._id); }}
                        className="px-6 py-3 bg-[#F9F7F5] text-[#8B5E3C] rounded-xl hover:bg-green-500 hover:text-white transition-all flex items-center gap-2 font-medium w-full md:w-auto justify-center"
                      >
                        <CheckCircle size={18} /> Apologized
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Resolved */}
          {resolvedComplaints.length > 0 && (
            <div className="opacity-70">
              <h2 className="text-2xl font-serif text-[#4B2E2E] mb-6 flex items-center gap-3">
                <CheckCircle className="text-green-500" /> Resolved History
              </h2>
              <div className="grid gap-4">
                {resolvedComplaints.map(c => (
                  <div key={c._id} className="bg-[#F9F7F5] p-6 rounded-2xl border border-[#F0EBE6] flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-serif text-[#4B2E2E] line-through decoration-[#8B5E3C]/30">{c.title}</h3>
                      <p className="text-[#8B5E3C] text-sm">{c.reason}</p>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full h-fit w-fit">Forgiven</span>
                  </div>
                ))}
              </div>
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
            className="fixed inset-0 z-[60] bg-[#4B2E2E]/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsAdding(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-lg shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-400" />
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-serif text-[#4B2E2E]">Log Issue</h3>
                  <p className="text-sm text-[#8B5E3C]">What did Sunny do wrong this time?</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-2 text-[#8B5E3C] hover:bg-[#F9F7F5] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAdd} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#8B5E3C] mb-2">The Crime</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Replied after 2 hours"
                    className="w-full px-5 py-4 bg-[#FAFAFA] border border-[#F0EBE6] focus:border-red-400 focus:bg-white rounded-xl outline-none transition-colors text-[#4B2E2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#8B5E3C] mb-2">The Details</label>
                  <textarea
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain the full situation..."
                    rows={4}
                    className="w-full px-5 py-4 bg-[#FAFAFA] border border-[#F0EBE6] focus:border-red-400 focus:bg-white rounded-xl outline-none transition-colors text-[#4B2E2E] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#8B5E3C] mb-2">Evidence (Photo)</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#F0EBE6] rounded-xl cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all group overflow-hidden">
                    {uploading ? (
                      <Loader2 className="animate-spin text-red-400" />
                    ) : imageUrl ? (
                      <div className="relative w-full h-full">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <CheckCircle className="text-white" size={24} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-[#8B5E3C]">
                        <Upload size={24} className="mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs">Click to upload proof</span>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-4 bg-[#4B2E2E] text-white rounded-xl hover:bg-red-500 transition-colors font-medium tracking-wide shadow-lg mt-4 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Submit Complaint"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
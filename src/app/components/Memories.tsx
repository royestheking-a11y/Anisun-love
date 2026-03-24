import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "./DataContext";
import { Calendar, Plus, X, ListTodo, CheckCircle2, Circle, Clock, Trash2, Loader2, Upload } from "lucide-react";
import axios from "axios";

export const Memories = () => {
  const { memories, addMemory, bucketList, addBucketListItem, toggleBucketListItem, deleteBucketListItem, loading } = useData();
  const [activeTab, setActiveTab] = useState<"milestones" | "dreams">("milestones");
  
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
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

  const [isAddingDream, setIsAddingDream] = useState(false);
  const [dreamTitle, setDreamTitle] = useState("");

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    await addMemory({ title, date, description, imageUrl });
    setTitle(""); setDate(""); setDescription(""); setImageUrl("");
    setIsAddingMilestone(false);
  };

  const handleAddDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamTitle) return;
    await addBucketListItem({ title: dreamTitle, completed: false });
    setDreamTitle("");
    setIsAddingDream(false);
  };

  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#4B2E2E]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#FAFAFA] py-20 px-4 md:px-12 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#8B5E3C] rounded-full blur-[150px] opacity-[0.04] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C9A227] rounded-full blur-[120px] opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-4 text-[#8B5E3C]">
            <Clock size={28} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif text-[#4B2E2E] mb-6"
          >
            Chronicles & <span className="italic text-[#C9A227]">Dreams</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#8B5E3C] to-transparent mx-auto mb-12"
          />

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-16">
            <button
              onClick={() => setActiveTab("milestones")}
              className={`flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-500 font-medium tracking-wide ${
                activeTab === "milestones" 
                ? "bg-[#4B2E2E] text-[#C9A227] shadow-[0_10px_30px_rgba(75,46,46,0.2)]" 
                : "bg-white text-[#8B5E3C] hover:bg-[#F9F7F5] border border-[#F0EBE6]"
              }`}
            >
              <Calendar size={18} /> Past Milestones
            </button>
            <button
              onClick={() => setActiveTab("dreams")}
              className={`flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-500 font-medium tracking-wide ${
                activeTab === "dreams" 
                ? "bg-[#4B2E2E] text-[#C9A227] shadow-[0_10px_30px_rgba(75,46,46,0.2)]" 
                : "bg-white text-[#8B5E3C] hover:bg-[#F9F7F5] border border-[#F0EBE6]"
              }`}
            >
              <ListTodo size={18} /> Future Dreams
            </button>
          </div>
        </div>

        <div className="min-h-[50vh]">
          <AnimatePresence mode="wait">
            {activeTab === "milestones" && (
              <motion.div
                key="milestones"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex justify-end mb-8">
                  <button 
                    onClick={() => setIsAddingMilestone(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-[#8B5E3C] rounded-xl hover:bg-[#8B5E3C] hover:text-white transition-colors border border-[#F0EBE6] shadow-sm font-medium"
                  >
                    <Plus size={18} /> Add Chapter
                  </button>
                </div>

                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-8 md:before:ml-[50%] before:-translate-x-px md:before:mx-auto before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#8B5E3C]/10 before:via-[#8B5E3C]/30 before:to-transparent">
                  {sortedMemories.map((m, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <motion.div
                        key={m._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group`}
                      >
                        <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 bg-white rounded-3xl border border-[#F0EBE6] shadow-[0_10px_30px_rgba(75,46,46,0.03)] hover:shadow-[0_20px_40px_rgba(75,46,46,0.08)] hover:border-[#C9A227]/30 transition-all duration-300 ml-auto md:ml-0 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                          <p className="text-[#C9A227] text-sm uppercase tracking-[0.2em] font-bold mb-3">
                            {new Date(m.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <h3 className="text-3xl font-serif text-[#4B2E2E] mb-4">{m.title}</h3>
                          {m.imageUrl && (
                            <div className="mb-4 rounded-2xl overflow-hidden border border-[#F0EBE6]">
                              <img src={m.imageUrl} alt={m.title} className="w-full h-48 object-cover" />
                            </div>
                          )}
                          {m.description && (
                            <p className="text-[#8B5E3C] leading-relaxed font-light text-lg">{m.description}</p>
                          )}
                        </div>

                        <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white border-4 border-[#F9F7F5] shadow-md group-hover:border-[#C9A227] transition-colors duration-500 z-10">
                          <div className="w-3 h-3 bg-[#8B5E3C] rounded-full group-hover:bg-[#C9A227] transition-colors" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {sortedMemories.length === 0 && (
                  <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-[#F0EBE6] border-dashed">
                    <p className="text-[#8B5E3C] text-xl font-serif italic">No chapters recorded yet.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "dreams" && (
              <motion.div
                key="dreams"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto"
              >
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(75,46,46,0.05)] border border-[#F0EBE6]">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#F0EBE6]">
                    <div>
                      <h2 className="text-3xl font-serif text-[#4B2E2E]">Our Bucket List</h2>
                      <p className="text-[#8B5E3C] mt-2 font-light">Things we promise to do together</p>
                    </div>
                    <button 
                      onClick={() => setIsAddingDream(true)}
                      className="p-4 bg-[#F9F7F5] text-[#8B5E3C] rounded-full hover:bg-[#4B2E2E] hover:text-[#C9A227] transition-all shadow-sm"
                    >
                      <Plus size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {bucketList.length === 0 ? (
                      <p className="text-center py-10 text-[#8B5E3C] font-serif italic">No dreams added yet.</p>
                    ) : (
                      bucketList.map((item, index) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 group ${
                            item.completed 
                            ? "bg-[#FAFAFA] border-transparent" 
                            : "bg-white border-[#F0EBE6] hover:border-[#8B5E3C]/30 shadow-sm"
                          }`}
                        >
                          <button 
                            onClick={() => { if(item._id) toggleBucketListItem(item._id, !item.completed); }}
                            className={`flex-shrink-0 transition-colors ${item.completed ? "text-[#C9A227]" : "text-[#E5DFD3] hover:text-[#8B5E3C]"}`}
                          >
                            {item.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                          </button>
                          <span className={`flex-1 text-lg transition-all ${item.completed ? "text-[#8B5E3C]/50 line-through font-light" : "text-[#4B2E2E] font-medium"}`}>
                            {item.title}
                          </span>
                          <button
                            onClick={() => { if(item._id) deleteBucketListItem(item._id); }}
                            className="p-2 text-[#E5DFD3] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Milestone Modal */}
      <AnimatePresence>
        {isAddingMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#4B2E2E]/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsAddingMilestone(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] p-10 w-full max-w-lg shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#C9A227]" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-serif text-[#4B2E2E]">New Chapter</h3>
                <button onClick={() => setIsAddingMilestone(false)} className="p-2 text-[#8B5E3C] hover:bg-[#F9F7F5] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddMilestone} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#8B5E3C] mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. First Date"
                    className="w-full px-5 py-4 bg-[#FAFAFA] border border-[#F0EBE6] focus:border-[#C9A227] focus:bg-white rounded-xl outline-none transition-colors text-[#4B2E2E]"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#8B5E3C] mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-5 py-4 bg-[#FAFAFA] border border-[#F0EBE6] focus:border-[#C9A227] focus:bg-white rounded-xl outline-none transition-colors text-[#4B2E2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#8B5E3C] mb-2">The Story</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write about this memory..."
                    rows={4}
                    className="w-full px-5 py-4 bg-[#FAFAFA] border border-[#F0EBE6] focus:border-[#C9A227] focus:bg-white rounded-xl outline-none transition-colors text-[#4B2E2E] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[#8B5E3C] mb-3">Memory Photo</label>
                  <label className="flex flex-col items-center justify-center w-full h-40 bg-[#FDFBF7] border-2 border-dashed border-[#F0EBE6] rounded-[2rem] cursor-pointer hover:border-[#C9A227]/50 hover:bg-[#F9F7F5] transition-all duration-500 group overflow-hidden shadow-inner">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-[#C9A227]" size={32} />
                        <span className="text-[10px] text-[#C9A227] tracking-[0.2em] uppercase animate-pulse">Developing...</span>
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
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-[#F0EBE6] shadow-sm">
                           <Upload size={20} className="text-[#8B5E3C]" />
                        </div>
                        <span className="text-[10px] text-[#8B5E3C]/40 tracking-[0.2em] uppercase">Capture This Moment</span>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-4 bg-[#4B2E2E] text-[#C9A227] rounded-xl hover:bg-[#3A2222] transition-colors font-medium tracking-wide shadow-lg shadow-[#4B2E2E]/20 mt-4 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Save to Chronicles"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Dream Modal */}
      <AnimatePresence>
        {isAddingDream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#4B2E2E]/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsAddingDream(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#C9A227]" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-serif text-[#4B2E2E]">New Dream</h3>
                <button onClick={() => setIsAddingDream(false)} className="p-2 text-[#8B5E3C] hover:bg-[#F9F7F5] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddDream} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#8B5E3C] mb-2">What do you want to do?</label>
                  <input
                    type="text"
                    required
                    value={dreamTitle}
                    onChange={(e) => setDreamTitle(e.target.value)}
                    placeholder="e.g. Build a blanket fort"
                    className="w-full px-5 py-4 bg-[#FAFAFA] border border-[#F0EBE6] focus:border-[#C9A227] focus:bg-white rounded-xl outline-none transition-colors text-[#4B2E2E]"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 bg-[#C9A227] text-white rounded-xl hover:bg-[#b58f1f] transition-colors font-medium tracking-wide shadow-lg shadow-[#C9A227]/20 mt-4"
                >
                  Add to Bucket List
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
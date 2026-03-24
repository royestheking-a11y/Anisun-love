import React, { useState } from "react";
import { motion } from "motion/react";
import { useData, MoodEntry } from "./DataContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Smile, Frown, Heart, Star, CloudRain, Flame, Loader2, Upload, CheckCircle2, Camera } from "lucide-react";
import axios from "axios";

const MOODS = ["Happy", "Love", "Excited", "Miss You", "Sad", "Angry"];
const MOOD_SCORES: Record<string, number> = {
  "Happy": 5, "Love": 6, "Excited": 4, "Miss You": 3, "Sad": 2, "Angry": 1
};

export const MoodTracker = () => {
  const { moods, addMood } = useData();
  const [partner, setPartner] = useState<"Sunny" | "Anisha">("Anisha");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const dToday = new Date();
  const today = `${dToday.getFullYear()}-${String(dToday.getMonth() + 1).padStart(2, '0')}-${String(dToday.getDate()).padStart(2, '0')}`;
  const todaysMood = moods.find(m => m.date === today && m.partner === partner);

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

  const handleSelectMood = async (mood: MoodEntry["mood"]) => {
    await addMood({ date: today, mood, partner, imageUrl });
    setImageUrl("");
  };

  // Prepare chart data (last 7 days for better visualization)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const chartData = last7Days.map(date => {
    const sMood = moods.find(m => m.date === date && m.partner === "Sunny");
    const aMood = moods.find(m => m.date === date && m.partner === "Anisha");
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      Sunny: sMood ? MOOD_SCORES[sMood.mood] : undefined,
      Anisha: aMood ? MOOD_SCORES[aMood.mood] : undefined,
      fullDate: date
    };
  });

  const getMoodIcon = (moodName: string) => {
    switch (moodName) {
      case "Happy": return <Smile className="text-yellow-500" />;
      case "Love": return <Heart className="text-red-500 fill-current" />;
      case "Excited": return <Star className="text-orange-400 fill-current" />;
      case "Miss You": return <CloudRain className="text-blue-400" />;
      case "Sad": return <Frown className="text-gray-500" />;
      case "Angry": return <Flame className="text-red-600" />;
      default: return null;
    }
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-[#F0EBE6]">
          <p className="font-serif text-[#4B2E2E] mb-2 font-bold">{label}</p>
          {payload.map((entry: any) => {
            const moodName = Object.keys(MOOD_SCORES).find(k => MOOD_SCORES[k] === entry.value);
            return (
              <p key={entry.name} className="flex items-center gap-2 text-sm" style={{ color: entry.color }}>
                {entry.name}: {moodName}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-full bg-[#FAFAFA] py-20 px-4 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif text-[#4B2E2E] mb-4">Emotional <span className="italic text-[#C9A227]">Waves</span></h1>
          <p className="text-[#8B5E3C] uppercase tracking-widest text-sm font-medium">How are we feeling today?</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(75,46,46,0.05)] border border-[#F0EBE6] mb-12">
          <div className="flex justify-center mb-8">
            <div className="flex bg-[#F9F7F5] p-1 rounded-full border border-[#F0EBE6]">
              {(["Anisha", "Sunny"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPartner(p)}
                  className={`px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                    partner === p ? "bg-[#4B2E2E] text-[#C9A227] shadow-md" : "text-[#8B5E3C] hover:text-[#4B2E2E]"
                  }`}
                >
                  {p}'s Mood
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {MOODS.map(mood => {
              const isActive = (todaysMood?.mood || todaysMood) === mood;
              return (
                <button
                  key={mood}
                  onClick={() => handleSelectMood(mood as any)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isActive 
                    ? "border-[#C9A227] bg-[#FDFBF7] shadow-lg shadow-[#C9A227]/10 scale-105" 
                    : "border-[#F0EBE6] bg-white hover:border-[#8B5E3C]/30 hover:bg-[#FAFAFA]"
                  }`}
                >
                  <div className="mb-3 scale-150">{getMoodIcon(mood)}</div>
                  <span className={`font-medium ${isActive ? "text-[#4B2E2E]" : "text-[#8B5E3C]"}`}>{mood}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center max-w-sm mx-auto mb-12">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B5E3C] mb-4">Mood Snap (Optional)</h4>
            <label className="w-full h-40 bg-[#FAFAFA] border-2 border-dashed border-[#F0EBE6] rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A227]/50 hover:bg-[#FDFBF7] transition-all duration-500 overflow-hidden group shadow-inner">
               {uploading ? (
                 <Loader2 className="animate-spin text-[#C9A227]" />
               ) : (imageUrl || todaysMood?.imageUrl) ? (
                 <div className="relative w-full h-full group">
                   <img src={imageUrl || todaysMood?.imageUrl} className="w-full h-full object-cover" alt="Mood" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                     <Camera className="text-white" size={32} />
                   </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-[#F0EBE6] shadow-sm">
                       <Camera size={20} className="text-[#8B5E3C]" />
                    </div>
                    <span className="text-[10px] text-[#8B5E3C]/40 tracking-widest uppercase">Add Visual Context</span>
                 </div>
               )}
               <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </div>

          <div className="border-t border-[#F0EBE6] pt-12">
            <h3 className="text-2xl font-serif text-[#4B2E2E] mb-8 text-center">7-Day Connection Sync</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EBE6" />
                  <XAxis dataKey="fullDate" axisLine={false} tickLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })} tick={{ fill: '#8B5E3C', fontSize: 12 }} />
                  <YAxis hide domain={[1, 6]} />
                  <Tooltip content={customTooltip} cursor={{ stroke: '#F0EBE6', strokeWidth: 2 }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="Anisha" stroke="#C9A227" strokeWidth={4} dot={{ r: 6, fill: "#C9A227" }} activeDot={{ r: 8 }} connectNulls />
                  <Line type="monotone" dataKey="Sunny" stroke="#4B2E2E" strokeWidth={4} dot={{ r: 6, fill: "#4B2E2E" }} activeDot={{ r: 8 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-4 text-xs text-[#8B5E3C] uppercase tracking-widest font-semibold">
              <span>Higher = Happier</span>
              <span>Lower = Needs Cuddles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
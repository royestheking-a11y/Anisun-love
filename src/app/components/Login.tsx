import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import { Lock, Heart } from "lucide-react";
import { motion } from "motion/react";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate("/");
    } else {
      setError("Incorrect username or password. This is a private portal.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#8B5E3C] rounded-full blur-[120px]" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#C9A227] rounded-full blur-[120px]" 
      />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-gray-100 p-8 rounded-3xl shadow-[0_20px_50px_rgba(75,46,46,0.05)] z-10 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#4B2E2E] rounded-full flex items-center justify-center text-[#C9A227]">
            <Heart size={32} fill="currentColor" />
          </div>
        </div>

        <h1 className="text-3xl text-[#4B2E2E] mb-2 font-serif">ANISUN</h1>
        <p className="text-[#8B5E3C] text-sm mb-8 font-sans tracking-widest uppercase">Our Love Story</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 bg-[#F9F7F5] border border-transparent rounded-xl focus:outline-none focus:border-[#8B5E3C] focus:bg-white transition-colors text-center text-[#4B2E2E] font-sans placeholder:text-[#8B5E3C]/50"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-[#F9F7F5] border border-transparent rounded-xl focus:outline-none focus:border-[#8B5E3C] focus:bg-white transition-colors text-center text-[#4B2E2E] font-sans placeholder:text-[#8B5E3C]/50"
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-[#4B2E2E] hover:bg-[#3A2222] text-[#C9A227] rounded-xl font-medium tracking-wide transition-all shadow-lg shadow-[#4B2E2E]/20 flex items-center justify-center gap-2"
          >
            <Lock size={18} /> Enter Our World
          </button>
        </form>
      </motion.div>
    </div>
  );
};
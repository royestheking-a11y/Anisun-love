import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gamepad2, Heart, Award, RefreshCcw, Loader2, Sparkles } from "lucide-react";
import { useData } from "./DataContext";

export const Quiz = () => {
  const { addQuizResult, quizQuestions, loading } = useData();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = async (optionIndex: number) => {
    if (!quizQuestions || quizQuestions.length === 0) return;
    setSelectedOption(optionIndex);
    
    let newScore = score;
    if (optionIndex === quizQuestions[currentQuestion].correctAnswer) {
      newScore = score + 1;
      setScore(newScore);
    }

    setTimeout(async () => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
        // Save result
        await addQuizResult({
          partner: "Anonymous", 
          score: newScore,
          total: quizQuestions.length,
          date: new Date().toISOString()
        });
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#4B2E2E]" size={48} />
      </div>
    );
  }

  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-8 text-center">
        <Sparkles className="text-[#C9A227] mb-4" size={48} />
        <h2 className="text-2xl font-serif text-[#4B2E2E]">No questions found!</h2>
        <p className="text-[#8B5E3C]">Add some questions to start the fun.</p>
      </div>
    );
  }

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const compatibility = Math.round((score / quizQuestions.length) * 100);

  return (
    <div className="min-h-full bg-[#FAFAFA] py-12 md:py-20 px-4 md:px-12 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-serif text-[#4B2E2E] mb-4 flex items-center justify-center gap-4">
          Couple Quiz <Gamepad2 className="text-[#C9A227] animate-bounce" size={40} />
        </h1>
        <div className="flex items-center justify-center gap-2">
          <div className="h-[1px] w-8 bg-[#C9A227]" />
          <p className="text-[#8B5E3C] uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold">The Ultimate Challenge</p>
          <div className="h-[1px] w-8 bg-[#C9A227]" />
        </div>
      </motion.div>

      <div className="w-full max-w-2xl relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#C9A227]/5 rounded-full blur-2xl -z-10" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#8B5E3C]/5 rounded-full blur-2xl -z-10" />

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_30px_70px_rgba(75,46,46,0.08)] border border-[#F0EBE6] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#F9F7F5]">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#C9A227] to-[#8B5E3C]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion) / quizQuestions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="flex justify-between items-center mb-10 mt-2 text-[#8B5E3C] text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2 px-3 py-1.5 bg-[#F9F7F5] rounded-full">
                  Question <span className="text-[#4B2E2E]">{currentQuestion + 1}</span> of {quizQuestions.length}
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 bg-[#F9F7F5] rounded-full">
                  Score: <span className="text-[#4B2E2E] font-serif text-lg">{score}</span>
                </span>
              </div>
              
              <h2 className="text-2xl md:text-4xl font-serif text-[#4B2E2E] mb-12 text-center leading-tight">
                {quizQuestions[currentQuestion].question}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {quizQuestions[currentQuestion].options.map((option, index) => {
                  let buttonClass = "bg-[#FAFAFA] text-[#8B5E3C] border-[#F0EBE6] hover:border-[#C9A227] hover:bg-white hover:shadow-xl hover:translate-y-[-2px]";
                  
                  if (selectedOption !== null) {
                    if (index === quizQuestions[currentQuestion].correctAnswer) {
                      buttonClass = "bg-green-50 text-green-700 border-green-500 scale-[1.02] shadow-lg ring-4 ring-green-100";
                    } else if (index === selectedOption) {
                      buttonClass = "bg-red-50 text-red-700 border-red-400 opacity-60";
                    } else {
                      buttonClass = "opacity-30 grayscale pointer-events-none";
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      disabled={selectedOption !== null}
                      onClick={() => handleAnswer(index)}
                      className={`w-full p-6 md:p-7 rounded-[1.25rem] border-2 text-left text-lg font-medium transition-all duration-300 relative group ${buttonClass}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          selectedOption === index ? "border-current" : "border-[#F0EBE6] group-hover:border-[#C9A227]"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 md:p-10 rounded-[2rem] shadow-[0_30px_70px_rgba(75,46,46,0.1)] border border-[#F0EBE6] text-center relative overflow-hidden"
            >
              <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#C9A227] rounded-full blur-[120px] opacity-[0.1]" />
              <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-[#8B5E3C] rounded-full blur-[100px] opacity-[0.05]" />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
              >
                <Award size={60} className="mx-auto text-[#C9A227] mb-4" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-serif text-[#4B2E2E] mb-2">Quiz Complete!</h2>
              <p className="text-[#8B5E3C] text-xs mb-6 uppercase tracking-widest font-semibold">Our Synchronicity Score</p>
              
              <div className="mb-8 relative flex justify-center">
                <div className="text-[5rem] md:text-[6.5rem] font-serif text-[#C9A227] leading-none mb-2 selection:bg-transparent">{compatibility}%</div>
                <div className="absolute -bottom-2 w-full text-xl font-bold uppercase tracking-[0.3em] text-[#4B2E2E] flex items-center justify-center gap-3">
                   <Heart className="text-red-500 fill-current animate-pulse" size={24} />
                </div>
              </div>

              <div className="text-[#4B2E2E] font-medium text-base md:text-xl mb-8 max-w-sm mx-auto leading-relaxed italic">
                {compatibility === 100 
                  ? '"You are my soul\'s reflection. A perfect 100!"' 
                  : compatibility >= 70 
                  ? '"Our bond is incredibly strong, just a few more memories to shared!"' 
                  : '"Time to go back to the Story page and relive our beautiful moments together!"'}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetQuiz}
                className="px-8 py-3.5 bg-[#4B2E2E] text-[#C9A227] rounded-full font-bold tracking-widest uppercase hover:bg-[#3A2222] transition-all flex items-center justify-center gap-3 mx-auto shadow-xl shadow-[#4B2E2E]/30"
              >
                <RefreshCcw size={18} className="animate-spin-slow" /> Re-Experience
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:5001/api";

export interface StoryMoment {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  date?: string;
  imageUrl?: string;
}

export interface GalleryImage {
  _id?: string;
  id?: string;
  url: string;
  category: "Our Selfies" | "Trips" | "Special Days" | "Random Moments";
}

export interface MemoryEvent {
  _id?: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

export interface BucketListItem {
  _id?: string;
  id?: string;
  title: string;
  completed: boolean;
}

export interface LoveMessage {
  _id?: string;
  id?: string;
  text: string;
  author: string;
  date: string;
  imageUrl?: string;
}

export interface Complaint {
  _id?: string;
  id?: string;
  title: string;
  reason: string;
  date: string;
  resolved: boolean;
  imageUrl?: string;
}

export interface MoodEntry {
  _id?: string;
  date: string; // YYYY-MM-DD
  mood: "Happy" | "Love" | "Excited" | "Miss You" | "Sad" | "Angry";
  partner: "Sunny" | "Anisha";
  imageUrl?: string;
}

export interface QuizQuestion {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface SecretItem {
  _id?: string;
  id?: string;
  type: "photo" | "note";
  content: string; // url or text
  date: string;
}

interface DataContextType {
  storyMoments: StoryMoment[];
  galleryImages: GalleryImage[];
  memories: MemoryEvent[];
  bucketList: BucketListItem[];
  messages: LoveMessage[];
  complaints: Complaint[];
  moods: MoodEntry[];
  quizQuestions: QuizQuestion[];
  secretData: SecretItem[];
  
  loading: boolean;
  
  addGalleryImage: (img: Omit<GalleryImage, "_id">) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;
  addMemory: (m: Omit<MemoryEvent, "_id">) => Promise<void>;
  addBucketListItem: (item: Omit<BucketListItem, "_id">) => Promise<void>;
  toggleBucketListItem: (id: string, completed: boolean) => Promise<void>;
  deleteBucketListItem: (id: string) => Promise<void>;
  addMessage: (msg: Omit<LoveMessage, "_id">) => Promise<void>;
  
  addComplaint: (c: Omit<Complaint, "_id">) => Promise<void>;
  resolveComplaint: (id: string) => Promise<void>;
  addMood: (m: Omit<MoodEntry, "_id">) => Promise<void>;
  addSecretItem: (item: Omit<SecretItem, "_id">) => Promise<void>;
  addStoryMoment: (moment: Omit<StoryMoment, "_id">) => Promise<void>;
  addQuizResult: (result: { partner: string, score: Number, total: Number, date: string }) => Promise<void>;
  getConfig: (key: string) => Promise<any>;
  updateConfig: (key: string, value: any) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [storyMoments, setStoryMoments] = useState<StoryMoment[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [memories, setMemories] = useState<MemoryEvent[]>([]);
  const [bucketList, setBucketList] = useState<BucketListItem[]>([]);
  const [messages, setMessages] = useState<LoveMessage[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [secretData, setSecretData] = useState<SecretItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [story, gallery, mems, bl, msgs, comps, md, secrets, questions] = await Promise.all([
        axios.get(`${API_URL}/story-moments`),
        axios.get(`${API_URL}/gallery`),
        axios.get(`${API_URL}/memories`),
        axios.get(`${API_URL}/bucket-list`),
        axios.get(`${API_URL}/messages`),
        axios.get(`${API_URL}/complaints`),
        axios.get(`${API_URL}/moods`),
        axios.get(`${API_URL}/secret-vault`),
        axios.get(`${API_URL}/quiz-questions`)
      ]);

      setStoryMoments(story.data);
      setGalleryImages(gallery.data);
      setMemories(mems.data);
      setBucketList(bl.data);
      setMessages(msgs.data);
      setComplaints(comps.data);
      setMoods(md.data);
      setSecretData(secrets.data);
      setQuizQuestions(questions.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addGalleryImage = async (img: Omit<GalleryImage, "_id">) => {
    const res = await axios.post(`${API_URL}/gallery`, img);
    setGalleryImages([...galleryImages, res.data]);
  };

  const deleteGalleryImage = async (id: string) => {
    await axios.delete(`${API_URL}/gallery/${id}`);
    setGalleryImages(galleryImages.filter(g => g._id !== id));
  };

  const addMemory = async (m: Omit<MemoryEvent, "_id">) => {
    const res = await axios.post(`${API_URL}/memories`, m);
    setMemories([...memories, res.data]);
  };

  const addBucketListItem = async (item: Omit<BucketListItem, "_id">) => {
    const res = await axios.post(`${API_URL}/bucket-list`, item);
    setBucketList([...bucketList, res.data]);
  };

  const toggleBucketListItem = async (id: string, completed: boolean) => {
    const res = await axios.put(`${API_URL}/bucket-list/${id}`, { completed });
    setBucketList(bucketList.map(item => item._id === id ? res.data : item));
  };

  const deleteBucketListItem = async (id: string) => {
    await axios.delete(`${API_URL}/bucket-list/${id}`);
    setBucketList(bucketList.filter(item => item._id !== id));
  };

  const addMessage = async (msg: Omit<LoveMessage, "_id">) => {
    const res = await axios.post(`${API_URL}/messages`, msg);
    setMessages([...messages, res.data]);
  };

  const addComplaint = async (c: Omit<Complaint, "_id">) => {
    const res = await axios.post(`${API_URL}/complaints`, c);
    setComplaints([...complaints, res.data]);
  };

  const resolveComplaint = async (id: string) => {
    const res = await axios.put(`${API_URL}/complaints/${id}`, { resolved: true });
    setComplaints(complaints.map(c => c._id === id ? res.data : c));
  };

  const addMood = async (m: Omit<MoodEntry, "_id">) => {
    const res = await axios.post(`${API_URL}/moods`, m);
    setMoods([...moods.filter(x => !(x.date === m.date && x.partner === m.partner)), res.data]);
  };

  const addSecretItem = async (item: Omit<SecretItem, "_id">) => {
    const res = await axios.post(`${API_URL}/secret-vault`, item);
    setSecretData([...secretData, res.data]);
  };

  const addStoryMoment = async (moment: Omit<StoryMoment, "_id">) => {
    const res = await axios.post(`${API_URL}/story-moments`, moment);
    setStoryMoments([...storyMoments, res.data]);
  };

  const addQuizResult = async (result: { partner: string, score: Number, total: Number, date: string }) => {
    await axios.post(`${API_URL}/quiz-results`, result);
  };

  const getConfig = async (key: string) => {
    const res = await axios.get(`${API_URL}/config/${key}`);
    return res.data.value;
  };

  const updateConfig = async (key: string, value: any) => {
    await axios.post(`${API_URL}/config`, { key, value });
  };

  return (
    <DataContext.Provider value={{ 
      storyMoments, galleryImages, memories, bucketList, messages, complaints, moods, secretData, quizQuestions,
      loading,
      addGalleryImage, deleteGalleryImage, addMemory, 
      addBucketListItem, toggleBucketListItem, deleteBucketListItem, addMessage,
      addComplaint, resolveComplaint, addMood, addSecretItem,
      addStoryMoment, addQuizResult, getConfig, updateConfig
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within a DataProvider");
  }
  return ctx;
};

const mongoose = require('mongoose');

const StoryMomentSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  imageUrl: String
}, { timestamps: true });

const GalleryImageSchema = new mongoose.Schema({
  url: String,
  category: {
    type: String,
    enum: ["Our Selfies", "Trips", "Special Days", "Random Moments"]
  }
}, { timestamps: true });

const MemoryEventSchema = new mongoose.Schema({
  title: String,
  date: String,
  description: String,
  imageUrl: String
}, { timestamps: true });

const BucketListItemSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const LoveMessageSchema = new mongoose.Schema({
  text: String,
  author: String,
  date: String,
  imageUrl: String
}, { timestamps: true });

const ComplaintSchema = new mongoose.Schema({
  title: String,
  reason: String,
  date: String,
  resolved: { type: Boolean, default: false },
  imageUrl: String
}, { timestamps: true });

const MoodEntrySchema = new mongoose.Schema({
  date: String,
  mood: { type: String, enum: ["Happy", "Love", "Excited", "Miss You", "Sad", "Angry"] },
  partner: { type: String, enum: ["Sunny", "Anisha"] },
  imageUrl: String
}, { timestamps: true });


const SecretItemSchema = new mongoose.Schema({
  type: { type: String, enum: ["photo", "note"] },
  content: String,
  date: String
}, { timestamps: true });

const QuizQuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number
}, { timestamps: true });

const QuizResultSchema = new mongoose.Schema({
  partner: String,
  score: Number,
  total: Number,
  date: String
}, { timestamps: true });

const ConfigSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: mongoose.Schema.Types.Mixed
});

module.exports = {
  StoryMoment: mongoose.model('StoryMoment', StoryMomentSchema),
  GalleryItem: mongoose.model('GalleryItem', GalleryImageSchema),
  Memory: mongoose.model('Memory', MemoryEventSchema),
  BucketListItem: mongoose.model('BucketListItem', BucketListItemSchema),
  LoveNote: mongoose.model('LoveNote', LoveMessageSchema),
  Complaint: mongoose.model('Complaint', ComplaintSchema),
  MoodEntry: mongoose.model('MoodEntry', MoodEntrySchema),
  SecretItem: mongoose.model('SecretItem', SecretItemSchema),
  QuizQuestion: mongoose.model('QuizQuestion', QuizQuestionSchema),
  QuizResult: mongoose.model('QuizResult', QuizResultSchema),
  Config: mongoose.model('Config', ConfigSchema)
};

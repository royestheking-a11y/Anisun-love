const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected successfully to:', process.env.MONGODB_URI.split('@')[1]))
  .catch(err => {
    console.error('MongoDB Connection Error Details:');
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    process.exit(1); // Exit on failure to see it in status
  });

// Generic Routes
app.get('/api/config/:key', async (req, res) => {
  const config = await models.Config.findOne({ key: req.params.key });
  res.json(config || { key: req.params.key, value: null });
});

app.post('/api/config', async (req, res) => {
  const { key, value } = req.body;
  const config = await models.Config.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true }
  );
  res.json(config);
});

// Generic CRUD helper (optional, but keep it simple for now)
const createRoutes = (model, path) => {
  app.get(`/api/${path}`, async (req, res) => {
    try {
      const data = await model.find().sort({ createdAt: -1 });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post(`/api/${path}`, async (req, res) => {
    try {
      const newItem = new model(req.body);
      const savedItem = await newItem.save();
      res.json(savedItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete(`/api/${path}/:id`, async (req, res) => {
    try {
      await model.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put(`/api/${path}/:id`, async (req, res) => {
    try {
      const updatedItem = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Create routes for all models
createRoutes(models.GalleryItem, 'gallery');
createRoutes(models.Memory, 'memories');
createRoutes(models.BucketListItem, 'bucket-list');
createRoutes(models.LoveNote, 'messages');
createRoutes(models.Complaint, 'complaints');
createRoutes(models.MoodEntry, 'moods');
createRoutes(models.QuizResult, 'quiz-results');
createRoutes(models.SecretItem, 'secret-vault');
createRoutes(models.StoryMoment, 'story-moments');
createRoutes(models.QuizQuestion, 'quiz-questions');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

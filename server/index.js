const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// File upload configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, 'questionnaire-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes
app.post('/api/upload-questionnaire', upload.single('questionnaire'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
      message: 'File uploaded successfully',
      filename: req.file.filename 
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post('/api/analyze-questionnaire', async (req, res) => {
  try {
    const { responses } = req.body;
    
    // This is where we'll integrate with ChatGPT
    // For now, returning mock data
    const mockResult = {
      healthSpanCategory: "Active Aging",
      interestAreas: ["Physical Wellness", "Mental Health", "Social Connection"],
      recommendedProgram: {
        name: "Holistic Wellness Journey",
        modules: [
          "Strength Training Fundamentals",
          "Mindfulness & Meditation",
          "Social Engagement Strategies"
        ]
      }
    };
    
    res.json(mockResult);
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
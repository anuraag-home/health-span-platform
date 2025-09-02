const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


// Update this with your exact Vercel URL
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://health-span-platform-5re3thdzu-anuraag-nallapatis-projects.vercel.app'
];


// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow same-origin or curl/postman with no origin
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  optionsSuccessStatus: 204
}));

// Ensure preflight works for all routes
app.options('*', cors());
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
    console.log('=== API Request Received ===');
    console.log('Request body:', req.body);
    
    const { responses, totalScore, healthSpanCategory, userInfo } = req.body;
    
    console.log('Extracted data:', { responses, totalScore, healthSpanCategory, userInfo });
    
    // Validate the data
    if (!responses || !totalScore || !healthSpanCategory || !userInfo || !userInfo.name || !userInfo.email) {
      console.log('Missing required data');
      return res.status(400).json({ 
        error: 'Missing required data (responses, totalScore, healthSpanCategory, name, email)',
        received: { responses, totalScore, healthSpanCategory, userInfo }
      });
    }
    
    console.log('Data validation passed');
    
    // Create a detailed prompt for ChatGPT
    const prompt = createAssessmentPrompt(responses, totalScore, healthSpanCategory, userInfo);
    
    console.log('Calling OpenAI API...');
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a compassionate health and wellness expert specializing in aging and longevity. Provide detailed, personalized assessments that are encouraging, actionable, and respectful of the individual's current health status. Focus on practical recommendations and positive reinforcement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });
    
    const aiAssessment = completion.choices[0].message.content;
    console.log('OpenAI response received');
    
    // Map health span categories to program recommendations
    const programMappings = {
      'Active Explorer': {
        name: 'Peak Performance Program',
        modules: [
          'Advanced Strength Training',
          'High-Intensity Interval Training',
          'Cognitive Enhancement',
          'Social Leadership',
          'Purpose-Driven Living'
        ]
      },
      'Steady Navigator': {
        name: 'Balanced Wellness Journey',
        modules: [
          'Moderate Exercise Program',
          'Stress Management',
          'Social Engagement',
          'Nutrition Optimization',
          'Sleep Hygiene'
        ]
      },
      'Support Seeker': {
        name: 'Gentle Wellness Path',
        modules: [
          'Low-Impact Exercise',
          'Mental Health Support',
          'Community Building',
          'Basic Nutrition',
          'Rest & Recovery'
        ]
      },
      'Dependent': {
        name: 'Compassionate Care Program',
        modules: [
          'Assisted Movement',
          'Emotional Support',
          'Family Connection',
          'Medical Nutrition',
          'Comfort Care'
        ]
      },
      'Declining': {
        name: 'Comfort & Dignity Program',
        modules: [
          'Gentle Movement',
          'Emotional Comfort',
          'Family Support',
          'Palliative Nutrition',
          'Peaceful Living'
        ]
      },
      'End-of-Life': {
        name: 'Compassionate End-of-Life Care',
        modules: [
          'Comfort Measures',
          'Emotional Support',
          'Family Connection',
          'Comfort Nutrition',
          'Peaceful Transition'
        ]
      }
    };
    
    // Get the recommended program based on health span category
    const recommendedProgram = programMappings[healthSpanCategory] || programMappings['Steady Navigator'];
    
    // For now, return mock interest areas (we'll enhance this later)
    const interestAreas = [
      'Physical Wellness',
      'Mental Health',
      'Social Connection'
    ];
    
    const result = {
      healthSpanCategory: healthSpanCategory,
      totalScore: totalScore,
      interestAreas: interestAreas,
      recommendedProgram: recommendedProgram,
      responses: responses,
      userInfo: userInfo,
      aiAssessment: aiAssessment
    };
    
    console.log('Sending response with AI assessment');
    res.json(result);
  } catch (error) {
    console.error('=== ERROR in analyze-questionnaire ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    
    // If OpenAI API fails, fall back to mock assessment
    if (error.message.includes('API key') || error.message.includes('OpenAI')) {
      console.log('OpenAI API error, falling back to mock assessment');
      const mockAssessment = `Based on your assessment, you scored ${req.body.totalScore} out of 40 points, placing you in the "${req.body.healthSpanCategory}" category. 

Your responses show particular strengths in areas where you scored 3 or 4, and areas for improvement where you scored 1 or 2. We recommend focusing on the areas that need the most attention while building on your existing strengths.

Note: AI assessment is temporarily unavailable. Please try again later.`;
      
      res.json({
        healthSpanCategory: req.body.healthSpanCategory,
        totalScore: req.body.totalScore,
        interestAreas: ['Physical Wellness', 'Mental Health', 'Social Connection'],
        recommendedProgram: {
          name: 'Wellness Program',
          modules: ['Health Assessment', 'Personalized Recommendations', 'Progress Tracking']
        },
        responses: req.body.responses,
        aiAssessment: mockAssessment
      });
    } else {
      res.status(500).json({ 
        error: 'Analysis failed: ' + error.message,
        details: error.toString()
      });
    }
  }
});

// Function to create a detailed prompt for ChatGPT
function createAssessmentPrompt(responses, totalScore, healthSpanCategory, userInfo) {
  const questionLabels = {
    mobility: 'Mobility & Stamina',
    independence: 'Daily Independence',
    energy: 'Energy & Vitality',
    cognitive: 'Cognitive Sharpness',
    social: 'Social Engagement',
    resilience: 'Emotional Resilience',
    chronic: 'Chronic Conditions',
    balance: 'Balance & Flexibility',
    support: 'Support Needs',
    purpose: 'Purpose & Outlook'
  };
  
  let responseText = `Health Assessment Results for ${userInfo.name} (${userInfo.email}):\n\n`;
  responseText += `Total Score: ${totalScore}/40\n`;
  responseText += `Health Span Category: ${healthSpanCategory}\n\n`;
  responseText += `Individual Question Responses:\n`;
  
  Object.entries(responses).forEach(([key, value]) => {
    const label = questionLabels[key] || key;
    responseText += `- ${label}: ${value}/4\n`;
  });
  
  responseText += `\nPlease provide a comprehensive, personalized assessment for ${userInfo.name} that includes:\n`;
  responseText += `1. A detailed interpretation of their current health status\n`;
  responseText += `2. Specific strengths and areas for improvement\n`;
  responseText += `3. Personalized recommendations for their wellness journey\n`;
  responseText += `4. Encouraging and actionable next steps\n`;
  responseText += `5. A compassionate tone that respects their current situation\n\n`;
  responseText += `Address them by name (${userInfo.name}) and focus on being supportive, practical, and motivating while being realistic about their current health span category.`;
  
  return responseText;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
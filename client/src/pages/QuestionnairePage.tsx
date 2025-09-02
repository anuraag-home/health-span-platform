import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QuestionnairePage.css';

interface QuestionnaireResponse {
  [key: string]: number;
}

const API_BASE = process.env.REACT_APP_API_BASE || '';

const QuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<QuestionnaireResponse>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleInputChange = (questionId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const calculateScore = () => {
    const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
    return totalScore;
  };

  const getHealthSpanCategory = (score: number) => {
    if (score >= 35) return "Active Explorer";
    if (score >= 28) return "Steady Navigator";
    if (score >= 20) return "Support Seeker";
    if (score >= 15) return "Dependent";
    if (score >= 10) return "Declining";
    return "End-of-Life";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let result;
      
      if (uploadedFile) {
        // Handle file upload
        const formData = new FormData();
        formData.append('questionnaire', uploadedFile);
        const uploadResponse = await axios.post(${API_BASE}/api/upload-questionnaire, formData);
        console.log('File uploaded:', uploadResponse.data);
      }

      // Calculate score and category
      const totalScore = calculateScore();
      const healthSpanCategory = getHealthSpanCategory(totalScore);

      // Analyze questionnaire responses
      const analysisResponse = await axios.post(${API_BASE}/api/analyze-questionnaire, {
        responses: responses,
        totalScore: totalScore,
        healthSpanCategory: healthSpanCategory
      });

      // Navigate to results page with the analysis
      navigate('/results', { 
        state: { 
          results: analysisResponse.data,
          responses: responses,
          totalScore: totalScore,
          healthSpanCategory: healthSpanCategory
        } 
      });

    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert('There was an error processing your questionnaire. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const questions = [
    {
      id: 'mobility',
      text: 'I can walk briskly for 15–20 minutes without fatigue.',
      category: 'Mobility & Stamina'
    },
    {
      id: 'independence',
      text: 'I can manage daily self-care (bathing, dressing, eating) without help.',
      category: 'Daily Independence'
    },
    {
      id: 'energy',
      text: 'I wake up feeling energetic and able to manage my day.',
      category: 'Energy & Vitality'
    },
    {
      id: 'cognitive',
      text: 'I can remember names, events, and manage tasks without frequent reminders.',
      category: 'Cognitive Sharpness'
    },
    {
      id: 'social',
      text: 'I actively meet or speak with friends, family, or community every week.',
      category: 'Social Engagement'
    },
    {
      id: 'resilience',
      text: 'I handle stress, setbacks, or health worries without feeling overwhelmed.',
      category: 'Emotional Resilience'
    },
    {
      id: 'chronic',
      text: 'My health conditions (if any) are well managed and don\'t limit my daily life.',
      category: 'Chronic Conditions'
    },
    {
      id: 'balance',
      text: 'I can bend, climb stairs, or stand up from a chair without difficulty.',
      category: 'Balance & Flexibility'
    },
    {
      id: 'support',
      text: 'I rarely need assistance from others for my daily routines.',
      category: 'Support Needs'
    },
    {
      id: 'purpose',
      text: 'I feel motivated about my future and look forward to activities.',
      category: 'Purpose & Outlook'
    }
  ];

  const totalScore = calculateScore();

  return (
    <div className="questionnaire-page">
      <div className="container">
        <h1>Health & Wellness Assessment</h1>
        <p>Please answer each question on a scale of 1 to 4:</p>
        
        <div className="scoring-guide">
          <h3>Scoring Guide:</h3>
          <ul>
            <li><strong>1</strong> = Never / Very Difficult</li>
            <li><strong>2</strong> = Sometimes / With Effort</li>
            <li><strong>3</strong> = Often / Manageable</li>
            <li><strong>4</strong> = Always / Very Easy</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="questionnaire-form">
          
          {questions.map((question, index) => (
            <div key={question.id} className="question">
              <label>
                <span className="question-number">{index + 1}.</span>
                <span className="question-category">{question.category}:</span>
                <span className="question-text">{question.text}</span>
              </label>
              
              <div className="radio-group">
                {[1, 2, 3, 4].map((value) => (
                  <label key={value} className="radio-option">
                    <input
                      type="radio"
                      name={question.id}
                      value={value}
                      checked={responses[question.id] === value}
                      onChange={(e) => handleInputChange(question.id, parseInt(e.target.value))}
                      required
                    />
                    <span className="radio-label">{value}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Current Score Display */}
          <div className="score-display">
            <h3>Current Score: {totalScore} / 40</h3>
            <p>Health Span Category: <strong>{getHealthSpanCategory(totalScore)}</strong></p>
          </div>

          {/* File Upload Section */}
          <section className="question-section">
            <h2>Alternative: Upload Completed Questionnaire</h2>
            <p>If you prefer, you can download our questionnaire template, fill it out, and upload it here:</p>
            
            <div className="file-upload">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                id="file-upload"
              />
              <label htmlFor="file-upload" className="file-upload-label">
                {uploadedFile ? uploadedFile.name : 'Choose a file or drag it here'}
              </label>
            </div>
          </section>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting || Object.keys(responses).length < 10}
          >
            {isSubmitting ? 'Processing...' : 'Submit Assessment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionnairePage;
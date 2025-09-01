import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QuestionnairePage.css';

interface QuestionnaireResponse {
  [key: string]: string | number;
}

const QuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<QuestionnaireResponse>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleInputChange = (questionId: string, value: string | number) => {
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let result;
      
      if (uploadedFile) {
        // Handle file upload
        const formData = new FormData();
        formData.append('questionnaire', uploadedFile);
        const uploadResponse = await axios.post('/api/upload-questionnaire', formData);
        console.log('File uploaded:', uploadResponse.data);
      }

      // Analyze questionnaire responses
      const analysisResponse = await axios.post('/api/analyze-questionnaire', {
        responses: responses
      });

      // Navigate to results page with the analysis
      navigate('/results', { 
        state: { 
          results: analysisResponse.data,
          responses: responses 
        } 
      });

    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert('There was an error processing your questionnaire. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="questionnaire-page">
      <div className="container">
        <h1>Health & Wellness Assessment</h1>
        <p>Please answer the following questions to help us create your personalized program.</p>

        <form onSubmit={handleSubmit} className="questionnaire-form">
          
          {/* Health Span Questions */}
          <section className="question-section">
            <h2>Health & Physical Wellness</h2>
            
            <div className="question">
              <label>What is your current age?</label>
              <input
                type="number"
                value={responses.age || ''}
                onChange={(e) => handleInputChange('age', e.target.value)}
                required
              />
            </div>

            <div className="question">
              <label>How would you rate your current physical activity level?</label>
              <select
                value={responses.activityLevel || ''}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                required
              >
                <option value="">Select an option</option>
                <option value="sedentary">Sedentary (little to no exercise)</option>
                <option value="lightly-active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="moderately-active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="very-active">Very Active (hard exercise 6-7 days/week)</option>
                <option value="extremely-active">Extremely Active (very hard exercise, physical job)</option>
              </select>
            </div>

            <div className="question">
              <label>Do you have any chronic health conditions?</label>
              <select
                value={responses.chronicConditions || ''}
                onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                required
              >
                <option value="">Select an option</option>
                <option value="none">None</option>
                <option value="diabetes">Diabetes</option>
                <option value="hypertension">Hypertension</option>
                <option value="heart-disease">Heart Disease</option>
                <option value="arthritis">Arthritis</option>
                <option value="other">Other</option>
              </select>
            </div>
          </section>

          {/* Seven Pillars Questions */}
          <section className="question-section">
            <h2>Interest Areas - Seven Pillars of Wellness</h2>
            
            <div className="question">
              <label>Physical Wellness - How interested are you in improving your physical fitness?</label>
              <select
                value={responses.physicalWellness || ''}
                onChange={(e) => handleInputChange('physicalWellness', e.target.value)}
                required
              >
                <option value="">Select an option</option>
                <option value="1">Not interested</option>
                <option value="2">Slightly interested</option>
                <option value="3">Somewhat interested</option>
                <option value="4">Very interested</option>
                <option value="5">Extremely interested</option>
              </select>
            </div>

            <div className="question">
              <label>Mental Health - How important is mental wellness to you?</label>
              <select
                value={responses.mentalHealth || ''}
                onChange={(e) => handleInputChange('mentalHealth', e.target.value)}
                required
              >
                <option value="">Select an option</option>
                <option value="1">Not important</option>
                <option value="2">Slightly important</option>
                <option value="3">Somewhat important</option>
                <option value="4">Very important</option>
                <option value="5">Extremely important</option>
              </select>
            </div>

            <div className="question">
              <label>Social Connection - How would you rate your current social connections?</label>
              <select
                value={responses.socialConnection || ''}
                onChange={(e) => handleInputChange('socialConnection', e.target.value)}
                required
              >
                <option value="">Select an option</option>
                <option value="1">Very isolated</option>
                <option value="2">Somewhat isolated</option>
                <option value="3">Moderate connections</option>
                <option value="4">Good connections</option>
                <option value="5">Excellent connections</option>
              </select>
            </div>

            <div className="question">
              <label>Nutrition - How interested are you in improving your diet?</label>
              <select
                value={responses.nutrition || ''}
                onChange={(e) => handleInputChange('nutrition', e.target.value)}
                required
              >
                <option value="">Select an option</option>
                <option value="1">Not interested</option>
                <option value="2">Slightly interested</option>
                <option value="3">Somewhat interested</option>
                <option value="4">Very interested</option>
                <option value="5">Extremely interested</option>
              </select>
            </div>

            <div className="question">
              <label>Sleep - How would you rate your current sleep quality?</label>
              <select
                value={responses.sleep || ''}
                onChange={(e) => handleInputChange('sleep', e.target.value)}
                required
              >
                <option value="">Select an option</option>
                <option value="1">Poor</option>
                <option value="2">Fair</option>
                <option value="3">Good</option>
                <option value="4">Very Good</option>
                <option value="5">Excellent</option>
              </select>
            </div>

            <div className="question">
              <label>Purpose & Meaning - How fulfilled do you feel in your life's purpose?</label>
              <select
                value={responses.purpose || ''}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                required
              >
                <option value="">Select an option</option>
                <option value="1">Not fulfilled</option>
                <option value="2">Slightly fulfilled</option>
                <option value="3">Somewhat fulfilled</option>
                <option value="4">Very fulfilled</option>
                <option value="5">Extremely fulfilled</option>
              </select>
            </div>

            <div className="question">
              <label>Financial Wellness - How secure do you feel about your financial future?</label>
              <select
                value={responses.financial || ''}
                onChange={(e) => handleInputChange('financial', e.target.value)}
                required
              >
                <option value="">Select an option</option>
                <option value="1">Very insecure</option>
                <option value="2">Somewhat insecure</option>
                <option value="3">Moderately secure</option>
                <option value="4">Secure</option>
                <option value="5">Very secure</option>
              </select>
            </div>
          </section>

          {/* File Upload Section */}
          <section className="question-section">
            <h2>Additional Information (Optional)</h2>
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Submit Assessment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionnairePage;
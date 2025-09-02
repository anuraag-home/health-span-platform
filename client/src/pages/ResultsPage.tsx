import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './ResultsPage.css';

interface ResultsData {
  healthSpanCategory: string;
  totalScore: number;
  interestAreas: string[];
  recommendedProgram: {
    name: string;
    modules: string[];
  };
  aiAssessment: string;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state?.results) {
      setResults(location.state.results);
    }
    setIsLoading(false);
  }, [location.state]);

  if (isLoading) {
    return (
      <div className="results-page">
        <div className="container">
          <div className="loading">Loading your personalized results...</div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-page">
        <div className="container">
          <div className="error">
            <h2>No Results Found</h2>
            <p>Please complete the questionnaire first.</p>
            <Link to="/questionnaire" className="cta-button">
              Take Assessment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="container">
        <header className="results-header">
          <h1>Your Personalized Wellness Assessment</h1>
          <p>Based on your responses, here's your comprehensive health span analysis</p>
        </header>

        {/* AI Assessment Section */}
        <section className="ai-assessment">
          <h2>Your Personalized Assessment</h2>
          <div className="assessment-card">
            <div className="assessment-content">
              {results.aiAssessment.split('\n').map((paragraph, index) => (
                <p key={index} className="assessment-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="health-span-category">
          <h2>Your Health Span Category</h2>
          <div className="category-card">
            <h3>{results.healthSpanCategory}</h3>
            <p>Total Score: {results.totalScore}/40</p>
            <p>This category reflects your current health status and aging trajectory.</p>
          </div>
        </section>

        <section className="interest-areas">
          <h2>Your Primary Interest Areas</h2>
          <div className="interest-grid">
            {results.interestAreas.map((area, index) => (
              <div key={index} className="interest-card">
                <h4>{area}</h4>
              </div>
            ))}
          </div>
        </section>

        <section className="recommended-program">
          <h2>Your Recommended Program</h2>
          <div className="program-card">
            <h3>{results.recommendedProgram.name}</h3>
            <p>This program is specifically designed for your health span category and interest areas.</p>
            
            <div className="modules-section">
              <h4>Program Modules:</h4>
              <ul className="modules-list">
                {results.recommendedProgram.modules.map((module, index) => (
                  <li key={index} className="module-item">
                    <span className="module-number">{index + 1}</span>
                    <span className="module-name">{module}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="next-steps">
          <h2>Next Steps</h2>
          <p>Ready to begin your personalized wellness journey?</p>
          <div className="cta-buttons">
            <a 
              href="https://calendly.com/your-company/consultation" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button primary"
            >
              Schedule Consultation
            </a>
            <Link to="/questionnaire" className="cta-button secondary">
              Retake Assessment
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResultsPage;
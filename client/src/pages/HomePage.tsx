import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <header className="hero">
        <h1>Welcome to Health Span Platform</h1>
        <p>Discover your personalized wellness journey for the second half of life</p>
      </header>
      
      <section className="company-intro">
        <h2>About Our Company</h2>
        <p>
          We specialize in creating personalized health and wellness programs 
          designed specifically for individuals in the second half of their life. 
          Our evidence-based approach combines the latest research in aging, 
          wellness, and lifestyle medicine to help you thrive.
        </p>
      </section>
      
      <section className="cta-section">
        <h2>Ready to Begin Your Journey?</h2>
        <p>Take our comprehensive assessment to discover your personalized program</p>
        <Link to="/questionnaire" className="cta-button">
          Start Assessment
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
app.post('/api/analyze-questionnaire', async (req, res) => {
  try {
    const { responses, totalScore, healthSpanCategory } = req.body;
    
    // Define the seven pillars of wellness
    const sevenPillars = [
      'Physical Wellness',
      'Mental Health', 
      'Social Connection',
      'Nutrition',
      'Sleep',
      'Purpose & Meaning',
      'Financial Wellness'
    ];
    
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
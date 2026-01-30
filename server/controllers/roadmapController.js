const Roadmap = require('../models/Roadmap');
const User = require('../models/User');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock_key');

exports.generateRoadmap = async (req, res) => {
  try {
    const { education, interests, skillLevel, careerGoal, hoursPerWeek } = req.body;
    
    // 1. Construct Prompt
    const interestsStr = Array.isArray(interests) ? interests.join(', ') : (interests || 'General Technology');
    
    const prompt = `
      Act as an expert career counselor and curriculum designer. Create a detailed learning roadmap for a student who wants to master the following SPECIFIC TRACK:
      - Primary Focus / Track: ${interestsStr}
      
      Student Profile:
      - Education: ${education || 'Not specified'}
      - Current Skill Level: ${skillLevel || 'Beginner'}
      - Career Goal: ${careerGoal || 'Software Engineer'}
      - Available Time: ${hoursPerWeek || '10'} hours/week

      Output the roadmap strictly in JSON format with the following structure:
      {
        "title": "${interestsStr} Mastery Roadmap",
        "description": "Brief description",
        "phases": [
          { 
            "phaseName": "Phase 1: Title", 
            "duration": "Weeks 1-2", 
            "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"], 
            "resources": [
              {"title": "Video: Title", "url": "https://...", "type": "video"},
              {"title": "Course: Title", "url": "https://...", "type": "course"},
              {"title": "Article: Title", "url": "https://...", "type": "article"}
            ] 
          }
        ],
        "projects": [
          { 
            "title": "Project Name", 
            "problemStatement": "Project details", 
            "tools": ["Skill 1", "Skill 2"],
            "implementationGuide": "Step 1: ...\nStep 2: ...",
            "githubLink": "https://github.com/..."
          }
        ]
      }
      IMPORTANT: 
      1. Create a COMPREHENSIVE roadmap with at least 4-6 PHASES strictly focused on "${interestsStr}".
      2. For EACH phase, provide at least 3 distinct resources: one VIDEO (YouTube), one FREE COURSE (Coursera/EdX/Udemy/FreeCodeCamp), and one ARTICLE/DOC.
      3. For EACH project, provide a step-by-step GUIDE (4-5 steps) AND a valid GitHub link (to a relevant starter repo or tutorial). The projects MUST be practical applications of "${interestsStr}".
      Ensure the content is practical, up-to-date, and tailored to the student's level.
    `;

    // 2. Call Gemini API
    let roadmapData;
    console.log("Generating roadmap for:", interestsStr);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from markdown code block if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
      
      roadmapData = JSON.parse(jsonStr);
    } catch (apiError) {
      console.error("Gemini API Error:", apiError);
      
      // --- Fallback Mock Data Logic ---
      
      const getMockRoadmap = (track, goal) => {
        // 1. Artificial Intelligence
        if (track === 'Artificial Intelligence') {
          return {
            title: "AI Mastery Roadmap",
            description: "A comprehensive guide to becoming an AI Engineer.",
            phases: [
              {
                phaseName: "Phase 1: Python & Math for AI",
                duration: "Weeks 1-4",
                topics: ["Python Syntax", "Linear Algebra", "Calculus", "Probability"],
                resources: [
                  { title: "Video: Python for Data Science", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", type: "video" },
                  { title: "Course: AI for Everyone (Coursera)", url: "https://www.coursera.org/learn/ai-for-everyone", type: "course" },
                  { title: "Article: Math for ML", url: "https://mml-book.github.io/", type: "article" }
                ]
              },
              {
                phaseName: "Phase 2: Machine Learning Algorithms",
                duration: "Weeks 5-8",
                topics: ["Regression", "Classification", "Clustering", "Dimensionality Reduction"],
                resources: [
                  { title: "Video: ML Algorithms", url: "https://www.youtube.com/watch?v=Gv9_4yMHFhI", type: "video" },
                  { title: "Course: ML by Andrew Ng", url: "https://www.coursera.org/specializations/machine-learning-introduction", type: "course" },
                  { title: "Article: Scikit-Learn Docs", url: "https://scikit-learn.org/stable/", type: "article" }
                ]
              }
            ],
            projects: [
              {
                title: "House Price Predictor",
                problemStatement: "Predict housing prices using regression.",
                tools: ["Regression", "Pandas", "Scikit-Learn"],
                implementationGuide: "Step 1: EDA\nStep 2: Feature Engineering\nStep 3: Train Model\nStep 4: Evaluate",
                githubLink: "https://github.com/ageron/handson-ml2"
              }
            ]
          };
        }

        // Default / Other Tracks
        return {
            title: `${goal || track} Roadmap`,
            description: "A customized learning path for your career goals.",
            phases: [
              { 
                phaseName: "Phase 1: Foundations", 
                duration: "Weeks 1-4", 
                topics: ["Core Concepts", "Tools Setup", "Basic Syntax", "Hello World"], 
                resources: [
                  {title: "Video: Intro to " + track, url: "https://www.youtube.com/results?search_query=" + encodeURIComponent("Intro to " + track), type: "video"},
                  {title: "Course: Learn " + track, url: "https://www.udemy.com/topic/" + track.toLowerCase().replace(' ', '-'), type: "course"},
                  {title: "Article: Getting Started", url: "https://medium.com/tag/" + track.toLowerCase().replace(' ', '-'), type: "article"}
                ] 
              },
              { 
                phaseName: "Phase 2: Intermediate Skills", 
                duration: "Weeks 5-8", 
                topics: ["Advanced Syntax", "Frameworks", "Best Practices", "Testing"], 
                resources: [
                  {title: "Video: Advanced " + track, url: "https://www.youtube.com/results?search_query=" + encodeURIComponent("Advanced " + track), type: "video"},
                  {title: "Course: Intermediate " + track, url: "https://www.coursera.org/search?query=" + encodeURIComponent(track), type: "course"},
                  {title: "Article: Best Practices", url: "https://dev.to/t/" + track.toLowerCase().replace(' ', ''), type: "article"}
                ] 
              }
            ],
            projects: [
              { 
                title: "Starter Project", 
                problemStatement: `Build a simple ${track} application to practice fundamentals.`, 
                tools: ["Basics", "Logic"],
                implementationGuide: "Step 1: Setup\nStep 2: Build Core\nStep 3: Test\nStep 4: Run",
                githubLink: "https://github.com/topics/" + track.toLowerCase().replace(' ', '-')
              }
            ]
        };
      };

      roadmapData = getMockRoadmap(interestsStr, careerGoal);
    }

    // 3. Save to DB
    // Map AI/Mock data fields to Mongoose Schema fields if they differ
    // Schema: phases: [{ phaseName, duration, goals, topics, resources: [{ title, url, type }] }]
    // AI/Mock: phases: [{ name/phaseName, weeks/duration, topics, resources: [{ name/title, url, type }] }]
    
    // Normalize data
    const normalizedPhases = roadmapData.phases.map(p => ({
      phaseName: p.phaseName || p.name,
      duration: p.duration || p.weeks,
      topics: p.topics,
      resources: p.resources.map(r => ({
        title: r.title || r.name,
        url: r.url,
        type: r.type
      }))
    }));

    const normalizedProjects = roadmapData.projects.map(p => ({
      title: p.title || p.name,
      problemStatement: p.problemStatement || p.description,
      tools: p.tools || p.skills,
      implementationGuide: Array.isArray(p.guide) ? p.guide.join('\n') : (p.implementationGuide || p.guide),
      githubLink: p.githubLink
    }));

    const newRoadmap = await Roadmap.create({
      user: req.user._id,
      goal: careerGoal || 'General',
      title: roadmapData.title,
      phases: normalizedPhases,
      projects: normalizedProjects
    });

    res.status(201).json({ success: true, data: newRoadmap });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.validatePhaseQuiz = async (req, res) => {
  try {
    const { phaseName, answers } = req.body;
    
    // Construct Prompt for Grading
    const prompt = `
      Act as a strict but fair professor. Evaluate the following student reflection quiz for the learning phase: "${phaseName}".
      
      Student Answers:
      1. Key Learnings: ${answers.learnings}
      2. Concept Explanation: ${answers.concept}
      
      Task:
      - Analyze if the answers demonstrate genuine understanding or if they are gibberish/too vague.
      - Assign a score from 1 to 10 based ONLY on the quality of their explanation.
      - Provide short constructive feedback (max 2 sentences).
      
      Output strictly in JSON format:
      {
        "score": number, // 1-10
        "feedback": "string",
        "passed": boolean // true if score >= 7
      }
    `;

    let evaluation = { score: 8, feedback: "Good reflection.", passed: true }; // Default fallback

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
    } catch (aiError) {
      console.error("AI Grading Error:", aiError);
      // Fallback: Use length validation
      if (answers.learnings.length > 30 && answers.concept.length > 30) {
          evaluation = { score: 7, feedback: "AI unavailable, but answers look detailed.", passed: true };
      } else {
          evaluation = { score: 4, feedback: "Answers too short. Please elaborate.", passed: false };
      }
    }

    res.status(200).json({ success: true, data: evaluation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

  exports.generatePhaseQuiz = async (req, res) => {
    try {
      const { phaseName } = req.body;
      
      const prompt = `
        Create a multiple-choice quiz (MCQ) to test a student's understanding of: "${phaseName}".
        
        Generate exactly 3 questions.
        Each question must have 4 options.
        Identify the correct answer index (0-3).
        
        Output strictly in JSON format:
        {
          "questions": [
            {
              "question": "Question text?",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctIndex": 0 // 0-3
            }
          ]
        }
      `;
  
      let quizData = { questions: [] };
  
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          quizData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        }
      } catch (aiError) {
        console.error("AI Quiz Generation Error:", aiError);
        // Fallback Mock Quiz
        quizData = {
          questions: [
            {
              question: "What is the primary goal of this phase?",
              options: ["To learn the basics", "To master advanced topics", "To skip to the end", "None of the above"],
              correctIndex: 0
            },
            {
              question: "Which concept is most important?",
              options: ["Concept A", "Concept B", "Concept C", "Concept D"],
              correctIndex: 1
            },
            {
              question: "How do you apply this knowledge?",
              options: ["By reading", "By practicing", "By sleeping", "By eating"],
              correctIndex: 1
            }
          ]
        };
      }
  
      res.status(200).json({ success: true, data: quizData });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };

exports.getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: roadmaps.length,
      data: roadmaps
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { roadmapId, itemId, type, completed, submissionLink } = req.body;

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    if (roadmap.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    let updated = false;

    if (type === 'project') {
        const project = roadmap.projects.id(itemId);
        if (project) {
            project.completed = completed;
            if (submissionLink) project.submissionLink = submissionLink;
            updated = true;
        }
    } else if (type === 'phase') {
        const phase = roadmap.phases.id(itemId);
        if (phase) {
            phase.completed = completed;
            updated = true;
        }
    }
    
    if (updated) {
        await roadmap.save();
    }

    // Update User Stats
    const user = await User.findById(req.user.id);
    if (completed) {
        user.readinessScore += 5;
        user.streak += 1;
        await user.save();
    }

    res.status(200).json({
      success: true,
      data: roadmap,
      readinessScore: user.readinessScore,
      streak: user.streak,
      badges: user.badges
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

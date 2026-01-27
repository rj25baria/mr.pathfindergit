const { Roadmap, User } = require('../utils/dbHelper');
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
            "name": "Phase 1: Title", 
            "weeks": "1-2", 
            "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"], 
            "resources": [
              {"name": "Video: Title", "url": "https://...", "type": "video"},
              {"name": "Course: Title", "url": "https://...", "type": "course"},
              {"name": "Article: Title", "url": "https://...", "type": "article"}
            ] 
          }
        ],
        "projects": [
          { 
            "name": "Project Name", 
            "description": "Project details", 
            "skills": ["Skill 1", "Skill 2"],
            "guide": ["Step 1: ...", "Step 2: ..."],
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
        const commonPhases = [
          { name: "Phase 1: Foundations", weeks: "1-4", topics: ["Basics", "Setup"], resources: [] },
          { name: "Phase 2: Advanced", weeks: "5-8", topics: ["Deep Dive", "Projects"], resources: [] }
        ];

        // 1. Artificial Intelligence
        if (track === 'Artificial Intelligence') {
          return {
            title: "AI Mastery Roadmap",
            description: "A comprehensive guide to becoming an AI Engineer.",
            phases: [
              {
                name: "Phase 1: Python & Math for AI",
                weeks: "1-4",
                topics: ["Python Syntax", "Linear Algebra", "Calculus", "Probability"],
                resources: [
                  { name: "Video: Python for Data Science", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", type: "video" },
                  { name: "Course: AI for Everyone (Coursera)", url: "https://www.coursera.org/learn/ai-for-everyone", type: "course" },
                  { name: "Article: Math for ML", url: "https://mml-book.github.io/", type: "article" }
                ]
              },
              {
                name: "Phase 2: Machine Learning Algorithms",
                weeks: "5-8",
                topics: ["Supervised Learning", "Unsupervised Learning", "Scikit-Learn", "Model Evaluation"],
                resources: [
                  { name: "Video: ML by Andrew Ng", url: "https://www.youtube.com/playlist?list=PLoROMvodv4rMiFQOnpMHy3ZGkYfLOAb5g", type: "video" },
                  { name: "Course: Machine Learning (Stanford)", url: "https://www.coursera.org/learn/machine-learning", type: "course" },
                  { name: "Docs: Scikit-Learn Guide", url: "https://scikit-learn.org/stable/user_guide.html", type: "article" }
                ]
              },
              {
                name: "Phase 3: Deep Learning & Neural Networks",
                weeks: "9-12",
                topics: ["Neural Networks", "TensorFlow/PyTorch", "CNNs", "RNNs"],
                resources: [
                  { name: "Video: Deep Learning Crash Course", url: "https://www.youtube.com/watch?v=VyWAvY2CF9c", type: "video" },
                  { name: "Course: Deep Learning Specialization", url: "https://www.coursera.org/specializations/deep-learning", type: "course" },
                  { name: "Article: PyTorch vs TensorFlow", url: "https://www.assemblyai.com/blog/pytorch-vs-tensorflow-in-2023/", type: "article" }
                ]
              }
            ],
            projects: [
              {
                name: "Sentiment Analysis Tool",
                description: "Build a model to analyze the sentiment of movie reviews.",
                skills: ["Python", "NLP", "Scikit-Learn"],
                guide: ["Step 1: Get IMDb dataset", "Step 2: Preprocess text", "Step 3: Train Classifier", "Step 4: Evaluate"],
                githubLink: "https://github.com/bentrevett/pytorch-sentiment-analysis"
              },
              {
                name: "Image Classifier",
                description: "Create a CNN to classify images from the CIFAR-10 dataset.",
                skills: ["Deep Learning", "CNN", "PyTorch"],
                guide: ["Step 1: Load Data", "Step 2: Define CNN Architecture", "Step 3: Train Model", "Step 4: Test Accuracy"],
                githubLink: "https://github.com/pytorch/examples/tree/main/mnist"
              }
            ]
          };
        }

        // 2. Web Development
        if (track === 'Web Development') {
          return {
            title: "Full Stack Web Dev Roadmap",
            description: "Become a Full Stack Developer from scratch.",
            phases: [
              {
                name: "Phase 1: HTML, CSS & JavaScript",
                weeks: "1-4",
                topics: ["Semantic HTML", "Flexbox/Grid", "ES6+ JavaScript", "DOM Manipulation"],
                resources: [
                  { name: "Video: JS Crash Course", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c", type: "video" },
                  { name: "Course: FreeCodeCamp Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", type: "course" },
                  { name: "Docs: MDN Web Docs", url: "https://developer.mozilla.org/en-US/", type: "article" }
                ]
              },
              {
                name: "Phase 2: Frontend Frameworks (React)",
                weeks: "5-8",
                topics: ["React Components", "Hooks", "State Management", "Routing"],
                resources: [
                  { name: "Video: React Course 2024", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", type: "video" },
                  { name: "Course: Scrimba React", url: "https://scrimba.com/learn/learnreact", type: "course" },
                  { name: "Article: React Official Docs", url: "https://react.dev/", type: "article" }
                ]
              },
              {
                name: "Phase 3: Backend & Database",
                weeks: "9-12",
                topics: ["Node.js", "Express", "MongoDB/SQL", "API Design"],
                resources: [
                  { name: "Video: Node.js Tutorial", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", type: "video" },
                  { name: "Course: The Odin Project", url: "https://www.theodinproject.com/", type: "course" },
                  { name: "Article: REST API Design", url: "https://restfulapi.net/", type: "article" }
                ]
              }
            ],
            projects: [
              {
                name: "Task Management App",
                description: "Build a Trello-like Kanban board.",
                skills: ["React", "Drag & Drop", "Local Storage"],
                guide: ["Step 1: Setup React", "Step 2: Create Column Components", "Step 3: Add Drag Logic", "Step 4: Style UI"],
                githubLink: "https://github.com/bradtraversy/react-crash-2024"
              },
              {
                name: "E-Commerce Dashboard",
                description: "Admin panel for an online store with charts and tables.",
                skills: ["MERN Stack", "Charts.js", "Authentication"],
                guide: ["Step 1: Build API", "Step 2: Create Frontend Layout", "Step 3: Connect Data", "Step 4: Deploy"],
                githubLink: "https://github.com/adrianhajdin/project_ecommerce_react"
              }
            ]
          };
        }

        // 3. Data Science
        if (track === 'Data Science') {
           return {
            title: "Data Science Career Path",
            description: "Master data analysis, visualization, and modeling.",
            phases: [
              {
                name: "Phase 1: Python & Pandas",
                weeks: "1-4",
                topics: ["Python Basics", "Pandas DataFrames", "NumPy", "Data Cleaning"],
                resources: [
                  { name: "Video: Pandas Tutorial", url: "https://www.youtube.com/watch?v=vmEHCJofslg", type: "video" },
                  { name: "Course: Kaggle Pandas", url: "https://www.kaggle.com/learn/pandas", type: "course" },
                  { name: "Docs: Pandas Documentation", url: "https://pandas.pydata.org/docs/", type: "article" }
                ]
              },
              {
                name: "Phase 2: Data Visualization",
                weeks: "5-8",
                topics: ["Matplotlib", "Seaborn", "Plotly", "Storytelling"],
                resources: [
                  { name: "Video: Data Viz with Python", url: "https://www.youtube.com/watch?v=uoSKLCEBlDc", type: "video" },
                  { name: "Course: Data Viz (Coursera)", url: "https://www.coursera.org/learn/python-plotting", type: "course" },
                  { name: "Article: Seaborn Gallery", url: "https://seaborn.pydata.org/examples/index.html", type: "article" }
                ]
              },
              {
                name: "Phase 3: Machine Learning Basics",
                weeks: "9-12",
                topics: ["Regression", "Classification", "Scikit-Learn", "Model Validation"],
                resources: [
                  { name: "Video: Intro to ML", url: "https://www.youtube.com/watch?v=i_LwzRVP7bg", type: "video" },
                  { name: "Course: Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course", type: "course" },
                  { name: "Article: ML Mastery", url: "https://machinelearningmastery.com/", type: "article" }
                ]
              }
            ],
            projects: [
              {
                name: "House Price Predictor",
                description: "Predict housing prices using regression.",
                skills: ["Regression", "Pandas", "Scikit-Learn"],
                guide: ["Step 1: EDA", "Step 2: Feature Engineering", "Step 3: Train Model", "Step 4: Evaluate"],
                githubLink: "https://github.com/ageron/handson-ml2"
              },
              {
                name: "COVID-19 Data Analysis",
                description: "Visualize trends in global COVID-19 data.",
                skills: ["Data Viz", "Plotly", "Storytelling"],
                guide: ["Step 1: Fetch Data", "Step 2: Clean Data", "Step 3: Create Interactive Plots", "Step 4: Publish"],
                githubLink: "https://github.com/CSSEGISandData/COVID-19"
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
                name: "Phase 1: Foundations", 
                weeks: "1-4", 
                topics: ["Core Concepts", "Tools Setup", "Basic Syntax", "Hello World"], 
                resources: [
                  {name: "Video: Intro to " + track, url: "https://www.youtube.com/results?search_query=" + encodeURIComponent("Intro to " + track), type: "video"},
                  {name: "Course: Learn " + track, url: "https://www.udemy.com/topic/" + track.toLowerCase().replace(' ', '-'), type: "course"},
                  {name: "Article: Getting Started", url: "https://medium.com/tag/" + track.toLowerCase().replace(' ', '-'), type: "article"}
                ] 
              },
              { 
                name: "Phase 2: Intermediate Skills", 
                weeks: "5-8", 
                topics: ["Advanced Syntax", "Frameworks", "Best Practices", "Testing"], 
                resources: [
                  {name: "Video: Advanced " + track, url: "https://www.youtube.com/results?search_query=" + encodeURIComponent("Advanced " + track), type: "video"},
                  {name: "Course: Intermediate " + track, url: "https://www.coursera.org/search?query=" + encodeURIComponent(track), type: "course"},
                  {name: "Article: Best Practices", url: "https://dev.to/t/" + track.toLowerCase().replace(' ', ''), type: "article"}
                ] 
              },
              { 
                name: "Phase 3: Real World Application", 
                weeks: "9-12", 
                topics: ["System Design", "Deployment", "Optimization", "Security"], 
                resources: [
                  {name: "Video: " + track + " Project Build", url: "https://www.youtube.com/results?search_query=" + encodeURIComponent("Build " + track + " project"), type: "video"},
                  {name: "Course: Professional " + track, url: "https://www.pluralsight.com/search?q=" + track, type: "course"},
                  {name: "Article: Industry Standards", url: "https://stackoverflow.com/questions/tagged/" + track.toLowerCase().replace(' ', '-'), type: "article"}
                ] 
              }
            ],
            projects: [
              { 
                name: "Starter Project", 
                description: `Build a simple ${track} application to practice fundamentals.`, 
                skills: ["Basics", "Logic"],
                guide: ["Step 1: Setup", "Step 2: Build Core", "Step 3: Test", "Step 4: Run"],
                githubLink: "https://github.com/topics/" + track.toLowerCase().replace(' ', '-')
              },
              { 
                name: "Advanced System", 
                description: `Create a complex ${track} system to showcase mastery.`, 
                skills: ["Advanced Concepts", "Architecture"],
                guide: ["Step 1: Design", "Step 2: Implement", "Step 3: Optimize", "Step 4: Deploy"],
                githubLink: "https://github.com/topics/" + track.toLowerCase().replace(' ', '-') + "-project"
              }
            ]
        };
      };

      roadmapData = getMockRoadmap(interestsStr, careerGoal);
    }

    // 3. Save to DB
    const newRoadmap = await Roadmap.create({
      userId: req.user.id,
      title: roadmapData.title,
      description: roadmapData.description,
      phases: roadmapData.phases,
      projects: roadmapData.projects
    });

    res.status(201).json({
      success: true,
      data: newRoadmap
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ where: { userId: req.user.id } });

    res.status(200).json({
      success: true,
      count: roadmap ? 1 : 0,
      data: roadmap ? [roadmap] : [] // Format as array to match frontend expectation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { roadmapId, itemId, type, completed, submissionLink } = req.body;

    const roadmap = await Roadmap.findByPk(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    // Verify ownership
    if (roadmap.userId !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Update logic for phases/projects stored as JSON
    let updated = false;
    let phases = [...roadmap.phases]; // Create copy
    let projects = [...roadmap.projects]; // Create copy

    if (type === 'phase' || type === 'topic') {
        // Iterate through phases to find the topic/phase (simplified logic)
        // In a real app, you'd want unique IDs for every topic
        // For now, we'll assume the frontend sends enough info or we just mark the roadmap progress
    } else if (type === 'project') {
        const projectIndex = projects.findIndex(p => p.name === itemId || p._id === itemId); // Handle name or ID
        if (projectIndex !== -1) {
            projects[projectIndex].completed = completed;
            if (submissionLink) projects[projectIndex].submissionLink = submissionLink;
            updated = true;
        }
    }

    if (updated) {
        roadmap.phases = phases;
        roadmap.projects = projects;
        await roadmap.save();
    }

    // Update User Stats (Simplified)
    const user = await User.findByPk(req.user.id);
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

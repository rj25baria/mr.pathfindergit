const bcrypt = require('bcryptjs');

const candidates = [
  {
    name: "Rahul Sharma",
    email: "rahul.demo@example.com",
    role: "student",
    education: "B.Tech CS",
    interests: ["Machine Learning", "Python", "Data Analysis"],
    careerGoal: "AI Researcher",
    readinessScore: 85,
    streak: 12,
    phone: "9876543210",
    skillLevel: "Advanced"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    role: "student",
    education: "B.Tech CS",
    interests: ["Web Development", "React", "Node.js"],
    careerGoal: "Full Stack Developer",
    readinessScore: 72,
    streak: 8,
    phone: "9123456789",
    skillLevel: "Intermediate"
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "student",
    education: "B.E. Electronics",
    interests: ["IoT", "Embedded Systems", "C++"],
    careerGoal: "IoT Engineer",
    readinessScore: 65,
    streak: 5,
    phone: "9988776655",
    skillLevel: "Intermediate"
  },
  {
    name: "Priya Patel",
    email: "priya.p@example.com",
    role: "student",
    education: "M.Sc Data Science",
    interests: ["Data Science", "R", "Statistics"],
    careerGoal: "Data Scientist",
    readinessScore: 92,
    streak: 20,
    phone: "9876500001",
    skillLevel: "Advanced"
  },
  {
    name: "Amit Kumar",
    email: "amit.k@example.com",
    role: "student",
    education: "BCA",
    interests: ["Mobile Dev", "Flutter", "Dart"],
    careerGoal: "Mobile App Developer",
    readinessScore: 55,
    streak: 3,
    phone: "9876500002",
    skillLevel: "Beginner"
  },
  {
    name: "Sneha Gupta",
    email: "sneha.g@example.com",
    role: "student",
    education: "B.Des",
    interests: ["UI/UX", "Figma", "Design Systems"],
    careerGoal: "Product Designer",
    readinessScore: 78,
    streak: 15,
    phone: "9876500003",
    skillLevel: "Intermediate"
  },
  {
    name: "Vikram Singh",
    email: "vikram.s@example.com",
    role: "student",
    education: "B.Tech IT",
    interests: ["Cybersecurity", "Network Security", "Ethical Hacking"],
    careerGoal: "Security Analyst",
    readinessScore: 88,
    streak: 18,
    phone: "9876500004",
    skillLevel: "Advanced"
  },
  {
    name: "Anjali Rao",
    email: "anjali.r@example.com",
    role: "student",
    education: "B.Tech CS",
    interests: ["Cloud Computing", "AWS", "Docker"],
    careerGoal: "Cloud Architect",
    readinessScore: 70,
    streak: 7,
    phone: "9876500005",
    skillLevel: "Intermediate"
  },
  {
    name: "Rohan Das",
    email: "rohan.d@example.com",
    role: "student",
    education: "B.Sc CS",
    interests: ["Game Development", "Unity", "C#"],
    careerGoal: "Game Developer",
    readinessScore: 60,
    streak: 4,
    phone: "9876500006",
    skillLevel: "Beginner"
  },
  {
    name: "Karthik Iyer",
    email: "karthik.i@example.com",
    role: "student",
    education: "B.Tech CS",
    interests: ["Blockchain", "Solidity", "Web3"],
    careerGoal: "Blockchain Developer",
    readinessScore: 82,
    streak: 10,
    phone: "9876500007",
    skillLevel: "Advanced"
  },
  {
    name: "Neha Verma",
    email: "neha.v@example.com",
    role: "student",
    education: "MCA",
    interests: ["DevOps", "CI/CD", "Kubernetes"],
    careerGoal: "DevOps Engineer",
    readinessScore: 75,
    streak: 9,
    phone: "9876500008",
    skillLevel: "Intermediate"
  },
  {
    name: "Arjun Reddy",
    email: "arjun.r@example.com",
    role: "student",
    education: "M.Tech Robotics",
    interests: ["Robotics", "ROS", "C++"],
    careerGoal: "Robotics Engineer",
    readinessScore: 89,
    streak: 14,
    phone: "9876500009",
    skillLevel: "Advanced"
  },
  {
    name: "Meera Nair",
    email: "meera.n@example.com",
    role: "student",
    education: "MBA",
    interests: ["Product Management", "Agile", "User Research"],
    careerGoal: "Product Manager",
    readinessScore: 68,
    streak: 6,
    phone: "9876500010",
    skillLevel: "Intermediate"
  }
];

const seedCandidates = async (User) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    
    // Only seed if database is empty or has very few users (e.g. < 5) to ensure we get the full 13
    if (studentCount < 5) {
      console.log(`Database has ${studentCount} students. Seeding 13 sample candidates...`);
      
      // Hash password once for all
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);
      
      const candidatesWithPassword = candidates.map(c => ({
        ...c,
        password: hashedPassword
      }));

      // Use insertMany for efficiency, ordered: false to continue if some duplicates exist
      try {
        await User.insertMany(candidatesWithPassword, { ordered: false });
        console.log('Successfully seeded 13 candidates.');
      } catch (insertError) {
        // If some duplicates existed, that's fine, just log it
        if (insertError.code === 11000) {
            console.log('Some candidates already existed (duplicate emails), skipped them.');
        } else {
            throw insertError;
        }
      }
    } else {
        console.log(`Database already has ${studentCount} students. Skipping seed.`);
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

module.exports = seedCandidates;

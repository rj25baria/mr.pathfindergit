const bcrypt = require('bcryptjs');

const candidates = [
  // From Screenshots (8 students)
  {
    name: "Zoya",
    email: "zoya@example.com",
    role: "student",
    education: "Undergraduate",
    interests: ["Web dev"],
    careerGoal: "Full stack engineer",
    readinessScore: 21,
    streak: 1,
    phone: "9876543211",
    skillLevel: "Beginner"
  },
  {
    name: "Om Shukla",
    email: "om11@gmail.com",
    role: "student",
    education: "12th Pass",
    interests: ["AI"],
    careerGoal: "Cybersecurity",
    readinessScore: 25,
    streak: 2,
    phone: "9123456790",
    skillLevel: "Beginner"
  },
  {
    name: "Ranjan Baria",
    email: "ranjan.baria00@gmail.com",
    role: "student",
    education: "Diploma",
    interests: ["AI"],
    careerGoal: "AI engineer",
    readinessScore: 20,
    streak: 1,
    phone: "9988776656",
    skillLevel: "Beginner"
  },
  {
    name: "Jiya sharma",
    email: "jiya@gmail.com",
    role: "student",
    education: "Graduate",
    interests: ["AWS"],
    careerGoal: "Full stack engineer",
    readinessScore: 15,
    streak: 1,
    phone: "9876500011",
    skillLevel: "Beginner"
  },
  {
    name: "Tanisha shah",
    email: "tanishashah14@gmail.com",
    role: "student",
    education: "Undergraduate",
    interests: ["AI"],
    careerGoal: "AI engg",
    readinessScore: 10,
    streak: 1,
    phone: "9876500012",
    skillLevel: "Beginner"
  },
  {
    name: "Kalpana",
    email: "kalpana5784@gmail.com",
    role: "student",
    education: "12th Pass",
    interests: ["Web design"],
    careerGoal: "Web designer",
    readinessScore: 21,
    streak: 1,
    phone: "9876500013",
    skillLevel: "Beginner"
  },
  {
    name: "richa",
    email: "richa@example.com",
    role: "student",
    education: "Diploma",
    interests: ["AI"],
    careerGoal: "AI engineer",
    readinessScore: 5,
    streak: 1,
    phone: "9876500014",
    skillLevel: "Beginner"
  },
  {
    name: "Shashi Tiwari",
    email: "jaymohab4272@gmail.com",
    role: "student",
    education: "Undergraduate",
    interests: ["Web development"],
    careerGoal: "Web developer",
    readinessScore: 9,
    streak: 1,
    phone: "9876500015",
    skillLevel: "Beginner"
  },
  // Previous 13 Beginner Students
  {
    name: "Aditya Sharma",
    email: "aditya.s@example.com",
    role: "student",
    education: "BTech",
    interests: ["Web Development", "HTML", "CSS"],
    careerGoal: "Frontend Developer",
    readinessScore: 35,
    streak: 2,
    phone: "9876543210",
    skillLevel: "Beginner"
  },
  {
    name: "Priya Singh",
    email: "priya.s@example.com",
    role: "student",
    education: "Diploma",
    interests: ["Web Development", "JavaScript", "HTML"],
    careerGoal: "Web Developer",
    readinessScore: 28,
    streak: 1,
    phone: "9123456789",
    skillLevel: "Beginner"
  },
  {
    name: "Raj Patel",
    email: "raj.p@example.com",
    role: "student",
    education: "BTech",
    interests: ["Java", "Programming", "Backend"],
    careerGoal: "Java Developer",
    readinessScore: 32,
    streak: 2,
    phone: "9988776655",
    skillLevel: "Beginner"
  },
  {
    name: "Kavya Nair",
    email: "kavya.n@example.com",
    role: "student",
    education: "Diploma",
    interests: ["Python", "Data Analysis", "SQL"],
    careerGoal: "Data Analyst",
    readinessScore: 31,
    streak: 1,
    phone: "9876500001",
    skillLevel: "Beginner"
  },
  {
    name: "Arjun Kumar",
    email: "arjun.k@example.com",
    role: "student",
    education: "BTech",
    interests: ["Database", "MySQL", "SQL"],
    careerGoal: "Database Developer",
    readinessScore: 29,
    streak: 2,
    phone: "9876500002",
    skillLevel: "Beginner"
  },
  {
    name: "Sneha Desai",
    email: "sneha.d@example.com",
    role: "student",
    education: "Diploma",
    interests: ["UI Design", "Web Design", "Graphics"],
    careerGoal: "Web Designer",
    readinessScore: 25,
    streak: 1,
    phone: "9876500003",
    skillLevel: "Beginner"
  },
  {
    name: "Vikram Reddy",
    email: "vikram.r@example.com",
    role: "student",
    education: "BTech",
    interests: ["Python", "Automation", "Linux"],
    careerGoal: "System Administrator",
    readinessScore: 30,
    streak: 2,
    phone: "9876500004",
    skillLevel: "Beginner"
  },
  {
    name: "Anjali Verma",
    email: "anjali.v@example.com",
    role: "student",
    education: "Diploma",
    interests: ["JavaScript", "Frontend", "Bootstrap"],
    careerGoal: "Frontend Developer",
    readinessScore: 27,
    streak: 1,
    phone: "9876500005",
    skillLevel: "Beginner"
  },
  {
    name: "Rohan Joshi",
    email: "rohan.j@example.com",
    role: "student",
    education: "BTech",
    interests: ["HTML", "CSS", "JavaScript"],
    careerGoal: "Web Developer",
    readinessScore: 33,
    streak: 2,
    phone: "9876500006",
    skillLevel: "Beginner"
  },
  {
    name: "Zara Khan",
    email: "zara.k@example.com",
    role: "student",
    education: "Diploma",
    interests: ["Mobile App", "Android", "Java"],
    careerGoal: "Android Developer",
    readinessScore: 26,
    streak: 1,
    phone: "9876500007",
    skillLevel: "Beginner"
  },
  {
    name: "Nikhil Gupta",
    email: "nikhil.g@example.com",
    role: "student",
    education: "BTech",
    interests: ["Networking", "IT Support", "Servers"],
    careerGoal: "IT Support Executive",
    readinessScore: 24,
    streak: 1,
    phone: "9876500008",
    skillLevel: "Beginner"
  },
  {
    name: "Divya Iyer",
    email: "divya.i@example.com",
    role: "student",
    education: "Diploma",
    interests: ["Business Analysis", "Excel", "Documentation"],
    careerGoal: "Business Analyst",
    readinessScore: 28,
    streak: 2,
    phone: "9876500009",
    skillLevel: "Beginner"
  },
  {
    name: "Sarthak Verma",
    email: "sarthak.v@example.com",
    role: "student",
    education: "BTech",
    interests: ["Testing", "QA", "Bug Testing"],
    careerGoal: "QA Engineer",
    readinessScore: 30,
    streak: 1,
    phone: "9876500010",
    skillLevel: "Beginner"
  },
  // High Scorer Students (7 advanced/intermediate)
  {
    name: "Rahul Sharma",
    email: "rahul.demo@example.com",
    role: "student",
    education: "BTech",
    interests: ["Machine Learning", "Python", "Data Analysis"],
    careerGoal: "AI Researcher",
    readinessScore: 85,
    streak: 12,
    phone: "9876543220",
    skillLevel: "Advanced"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    role: "student",
    education: "BTech",
    interests: ["Web Development", "React", "Node.js"],
    careerGoal: "Full Stack Developer",
    readinessScore: 72,
    streak: 8,
    phone: "9123456788",
    skillLevel: "Intermediate"
  },
  {
    name: "Priya Patel",
    email: "priya.p@example.com",
    role: "student",
    education: "Diploma",
    interests: ["Data Science", "R", "Statistics"],
    careerGoal: "Data Scientist",
    readinessScore: 92,
    streak: 20,
    phone: "9876500016",
    skillLevel: "Advanced"
  },
  {
    name: "Vikram Singh",
    email: "vikram.s@example.com",
    role: "student",
    education: "BTech",
    interests: ["Cybersecurity", "Network Security", "Ethical Hacking"],
    careerGoal: "Security Analyst",
    readinessScore: 88,
    streak: 18,
    phone: "9876500017",
    skillLevel: "Advanced"
  },
  {
    name: "Karthik Iyer",
    email: "karthik.i@example.com",
    role: "student",
    education: "BTech",
    interests: ["Blockchain", "Solidity", "Web3"],
    careerGoal: "Blockchain Developer",
    readinessScore: 82,
    streak: 10,
    phone: "9876500018",
    skillLevel: "Advanced"
  },
  {
    name: "Neha Verma",
    email: "neha.v@example.com",
    role: "student",
    education: "Diploma",
    interests: ["DevOps", "CI/CD", "Kubernetes"],
    careerGoal: "DevOps Engineer",
    readinessScore: 75,
    streak: 9,
    phone: "9876500019",
    skillLevel: "Intermediate"
  },
  {
    name: "Arjun Reddy",
    email: "arjun.r@example.com",
    role: "student",
    education: "BTech",
    interests: ["Robotics", "ROS", "C++"],
    careerGoal: "Robotics Engineer",
    readinessScore: 89,
    streak: 14,
    phone: "9876500020",
    skillLevel: "Advanced"
  },
  {
    name: "Anjali Rao",
    email: "anjali.r@example.com",
    role: "student",
    education: "BTech",
    interests: ["Cloud Computing", "AWS", "Docker"],
    careerGoal: "Cloud Architect",
    readinessScore: 70,
    streak: 7,
    phone: "9876500021",
    skillLevel: "Intermediate"
  }
];

// Demo HR User for Testing
const demoHRUser = {
  name: "Admin HR",
  email: "hr@demo.com",
  phone: "9999999999",
  role: "hr",
  password: "password123"
};

const seedCandidates = async (User) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const hrCount = await User.countDocuments({ role: 'hr' });
    
    // Seed HR user if doesn't exist
    if (hrCount === 0) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(demoHRUser.password, salt);
        await User.create({
          ...demoHRUser,
          password: hashedPassword,
          consent: true
        });
        console.log('Demo HR user created: hr@demo.com / password123');
      } catch (hrErr) {
        if (hrErr.code !== 11000) {
          console.error('Error creating HR user:', hrErr);
        }
      }
    }
    
    // Only seed if database is empty or has very few users (e.g. < 5) to ensure we get the full 28
    if (studentCount < 5) {
      console.log(`Database has ${studentCount} students. Seeding 28 sample candidates...`);
      
      // Hash password once for all
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);
      
      const candidatesWithPassword = candidates.map(c => ({
        ...c,
        password: hashedPassword,
        dateOfBirth: new Date('1995-01-01'),
        consent: true
      }));

      // Use insertMany for efficiency, ordered: false to continue if some duplicates exist
      try {
        await User.insertMany(candidatesWithPassword, { ordered: false });
        console.log('Successfully seeded 28 candidates.');
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

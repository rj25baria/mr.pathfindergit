# 🎓 Mr. Pathfinder - Career Coaching Platform

> A beginner-friendly career coaching platform designed to guide students through their professional journey.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node.js](https://img.shields.io/badge/node.js-18+-green)
![React](https://img.shields.io/badge/react-19+-blue)
![License](https://img.shields.io/badge/license-ISC-gray)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Testing Credentials](#-testing-credentials)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 👨‍🎓 For Students
- ✅ **User Authentication** - Secure signup/login with email and password
- ✅ **Contact Number Tracking** - Maintain both primary and alternate contact numbers
- ✅ **Readiness Assessment** - Track career readiness on a 0-100 scale
- ✅ **Skill Interests** - Define and track technology interests
- ✅ **Career Goals** - Set and monitor career objectives
- ✅ **Responsive Dashboard** - Mobile-friendly student interface
- ✅ **Profile Management** - Edit education, interests, and goals

### 👔 For HR/Recruiters
- ✅ **Candidate Search** - Find talent by skills and minimum readiness score
- ✅ **Card-Based Grid View** - Modern candidate browsing experience
- ✅ **Contact Management** - View and manage candidate contact information
- ✅ **Candidate Profiles** - Detailed view with editable information
- ✅ **Quick Actions** - Email and call functionality with one-click actions
- ✅ **Candidate Removal** - Manage candidate database
- ✅ **Stats Dashboard** - Total candidates, job-ready count, top streaks

### 🌐 General
- ✅ **Dark/Light Mode** - Theme switcher (ready for implementation)
- ✅ **Responsive Design** - Works on all devices
- ✅ **CORS Enabled** - Secure cross-origin communication
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-Based Access** - Student and HR different permissions
- ✅ **Sample Data** - Pre-loaded with 28 beginner-friendly students

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Framer Motion** - Animations (ready)

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **MongoDB** - Primary database
- **Mongoose** - ODM
- **MongoDB Memory Server** - In-memory fallback
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

### DevOps & Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **GitHub** - Version control & CI/CD
- **MongoDB Atlas** - Cloud database

---

## 📁 Project Structure

```
mr.pathfinder/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── TrendingTicker.jsx
│   │   ├── pages/
│   │   │   ├── Auth.jsx            # Login/Signup
│   │   │   ├── HRDashboard.jsx     # HR Portal
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── Landing.jsx
│   │   │   └── Profile.jsx
│   │   ├── utils/
│   │   │   ├── api.js              # Axios instance
│   │   │   └── config.js           # Environment config
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                          # Express Backend
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Roadmap.js
│   │   ├── Feedback.js
│   │   └── CandidateAlert.js       # Signup alerts
│   ├── controllers/
│   │   ├── authController.js       # Auth logic
│   │   ├── hrController.js         # HR operations
│   │   └── roadmapController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── hrRoutes.js
│   │   └── feedbackRoutes.js
│   ├── middleware/
│   │   └── auth.js                 # JWT verification
│   ├── seedData.js                 # Sample data (28 students)
│   ├── server.js                   # Express app
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md             # Traditional deployment guide
├── VERCEL_RENDER_DEPLOYMENT.md     # Modern deployment guide
├── vercel.json                     # Vercel configuration
├── render.yaml                     # Render blueprint
└── .gitignore                      # Git ignore rules
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free tier available)

### Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/rj25baria/mr.pathfindergit.git
   cd mr.pathfindergit
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env  # Configure with your MongoDB URI
   npm run dev
   ```

3. **Frontend Setup** (in new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - API Docs: http://localhost:5000/api/

---

## 📦 Deployment

### Automated Deployment (Recommended)

See [VERCEL_RENDER_DEPLOYMENT.md](./VERCEL_RENDER_DEPLOYMENT.md) for:
- ✅ Render Blueprint for backend
- ✅ Vercel for frontend
- ✅ Environment variable setup
- ✅ MongoDB Atlas configuration

### Manual Deployment

1. **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Backend**: [Render](https://render.com/) (Node.js Web Service)
3. **Frontend**: [Vercel](https://vercel.com/) (React/Vite)

**Deployment Checklist:**
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] Network access configured (allow 0.0.0.0/0)
- [ ] Render backend deployed with environment variables
- [ ] Vercel frontend deployed with VITE_API_URL set
- [ ] CORS enabled in backend with frontend URL
- [ ] Test login functionality
- [ ] Verify candidate search works

---

## 🔌 API Documentation

### Authentication Endpoints

#### Signup
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "contactNumber": "9999999999",
  "password": "SecurePass123",
  "role": "student",
  "education": "BTech",
  "interests": ["React", "Node.js"],
  "careerGoal": "Full Stack Developer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### HR Endpoints

#### Search Candidates
```http
POST /api/hr/search
Content-Type: application/json

{
  "skill": "React",
  "minScore": 50
}
```

#### Get Candidate Alerts
```http
GET /api/hr/alerts
Authorization: Bearer <jwt_token>
```

#### View Candidate Profile
```http
GET /api/hr/candidate/:id
Authorization: Bearer <jwt_token>
```

---

## 🔐 Testing Credentials

### HR Login
- **Email:** `hr@demo.com`
- **Password:** `password123`

### Sample Students (Included)
1. **Zoya** - zoya@example.com (Score: 21)
2. **Om Shukla** - om11@gmail.com (Score: 25)
3. **Ranjan Baria** - ranjan.baria00@gmail.com (Score: 20)
4. **Rahul Sharma** - rahul.demo@example.com (Score: 85) - High scorer
5. **Priya Patel** - priya.p@example.com (Score: 92) - Top scorer
6. **Vikram Singh** - vikram.s@example.com (Score: 88) - Advanced

All sample students use password: `password123`

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` environment variable
- Verify backend is running on port 5000
- Check CORS configuration in server.js
- Review browser console for errors

### MongoDB connection failed
- Verify MongoDB Atlas connection string in `.env`
- Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)
- Ensure database user credentials are correct
- Try local MongoDB as fallback

### Login not working
- Clear browser cookies and localStorage
- Check JWT_SECRET matches between backend and token
- Verify user exists in database
- Check password hashing in bcryptjs

### Build failures on Vercel/Render
- Check Node.js version (18+ required)
- Verify all dependencies are in package.json
- Check build command in vercel.json/render.yaml
- Review deployment logs in dashboard

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License - see LICENSE file for details.

---

## 👨‍💼 Support

For questions or issues:
- Open an issue on [GitHub Issues](https://github.com/rj25baria/mr.pathfindergit/issues)
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for common issues
- Review [VERCEL_RENDER_DEPLOYMENT.md](./VERCEL_RENDER_DEPLOYMENT.md) for deployment help

---

## 🎯 Future Enhancements

- [ ] Dashboard analytics and insights
- [ ] Video interview training modules
- [ ] AI-powered resume review
- [ ] Job matching algorithm
- [ ] Company partnership portal
- [ ] Email notifications
- [ ] SMS integration
- [ ] Payment integration for premium features

---

**Repository:** [github.com/rj25baria/mr.pathfindergit](https://github.com/rj25baria/mr.pathfindergit)  
**Last Updated:** February 2, 2026  
**Status:** ✅ Production Ready

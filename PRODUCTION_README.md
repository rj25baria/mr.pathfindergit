# 🎓 Mr. Pathfinder – Career Coaching Platform

A full-stack career coaching and talent discovery platform that helps students prepare for their careers and enables HR teams to discover job-ready candidates efficiently.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node.js](https://img.shields.io/badge/node.js-18+-green)
![React](https://img.shields.io/badge/react-19+-blue)
![License](https://img.shields.io/badge/license-ISC-gray)

---

## 📑 Table of Contents

- Features
- Tech Stack
- Project Structure
- Quick Start
- Deployment
- API Reference
- Test Credentials
- Troubleshooting
- Future Enhancements

---

## ✨ Features

### 👨‍🎓 Student Features
- User authentication (Signup / Login)
- Primary & alternate contact number support
- Career readiness score (0–100)
- Skill & technology interests
- Career goal tracking
- Profile management
- Responsive dashboard

### 👔 HR / Recruiter Features
- Secure HR login
- Candidate search & filtering
- Card-based candidate grid
- View detailed student profiles
- Click-to-call & email actions
- Alternate contact number visibility
- Recent signup alerts
- Candidate management (remove/view)

### 🌐 Platform Features
- JWT-based authentication
- Role-based access control
- CORS enabled backend
- Responsive UI
- Sample seeded data

---

## 🛠 Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- Lucide React
- Framer Motion (ready)

### Backend
- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas
- GitHub

---

## 📁 Project Structure

mr-pathfinder/
├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── utils/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ └── vite.config.js
│
├── server/
│ ├── models/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── server.js
│ └── package.json
│
├── DEPLOYMENT_GUIDE.md
├── VERCEL_RENDER_DEPLOYMENT.md
├── vercel.json
├── render.yaml
└── .gitignore


---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm
- MongoDB Atlas account

### Clone Repository

git clone https://github.com/rj25baria/mr-pathfindergit.git
cd mr-pathfindergit

Backend Setup
cd server
npm install
cp .env.example .env
npm run dev

Frontend Setup
cd client
npm install
npm run dev

Access URLs

Frontend: http://localhost:5173

Backend: http://localhost:5000

📦 Deployment
Recommended

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

Required Environment Variables
VITE_API_URL=
MONGODB_URI=
JWT_SECRET=


Ensure CORS allows the frontend domain.

🔌 API Reference
Register User
POST /api/auth/register

Login
POST /api/auth/login

Search Candidates (HR)
POST /api/hr/search

View Candidate Profile
GET /api/hr/candidate/:id

🔐 Test Credentials
HR Login

Email: zoya3@gmail.com
Password: password123

Redirects to /hr-dashboard

Student Login

Email: jaya23@gmail.com
Password: abc@1234

Redirects to /dashboard

🐛 Troubleshooting
Frontend shows server error

Check VITE_API_URL

Verify backend deployment

Check browser Network tab

Confirm CORS configuration

MongoDB connection failed

Verify MongoDB Atlas URI

Check IP whitelist (0.0.0.0/0)

Confirm database credentials

Login not working

Clear browser storage

Verify JWT secret

Ensure user exists in database

🚀 Future Enhancements

AI-based career guidance

Resume analysis

Job matching system

Email & SMS notifications

Analytics dashboard

Premium plans

📄 License

ISC License

🔗 Repository

https://github.com/rj25baria/mr-pathfindergit

Status: Production Ready
Last Updated: February 2026

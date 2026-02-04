🎓 Mr. Pathfinder — Career Coaching & Talent Discovery Platform

Mr. Pathfinder is a full-stack career coaching and talent discovery platform that helps students prepare for their careers while enabling HR teams to discover, evaluate, and connect with job-ready candidates efficiently.

📌 Overview

Mr. Pathfinder bridges the gap between students and recruiters by combining:

Career readiness tracking

Skill-based profiling

HR-focused candidate dashboards

Secure role-based authentication

Designed to be beginner-friendly, scalable, and production-ready.

📋 Table of Contents

Features

Tech Stack

Project Structure

Quick Start

Deployment

API Reference

Test Credentials

Troubleshooting

Future Roadmap

✨ Features
👨‍🎓 Student Portal

Secure signup & login

Primary & alternate contact number management

Career readiness score (0–100)

Skill & technology interest tracking

Career goal definition

Profile editing (education, interests, goals)

Fully responsive dashboard

👔 HR / Recruiter Portal

Role-based secure login

Candidate discovery by skill & readiness score

Modern card-based candidate grid

Quick email & call actions

Detailed candidate profile modal

Alternate contact number visibility

Candidate removal & management

Recent signup alerts

Statistics dashboard (total candidates, job-ready count)

🌐 Platform Features

JWT-based authentication

Role-based access control (Student / HR)

Secure CORS configuration

Responsive UI for all devices

Sample seeded data for testing

Clean UI ready for dark/light mode extension

🛠 Tech Stack
Frontend

React 19

Vite

Tailwind CSS

React Router

Axios

React Hot Toast

Lucide Icons

Framer Motion (animation-ready)

Backend

Node.js

Express 5

MongoDB & MongoDB Atlas

Mongoose

JWT Authentication

bcryptjs

CORS enabled API

Deployment & DevOps

Vercel (Frontend)

Render (Backend)

MongoDB Atlas (Database)

GitHub (CI/CD & version control)

📁 Project Structure
mr.pathfinder/
├── client/            # React frontend
├── server/            # Express backend
├── DEPLOYMENT_GUIDE.md
├── VERCEL_RENDER_DEPLOYMENT.md
├── vercel.json
├── render.yaml
└── .gitignore


(Well-structured and scalable for future expansion.)

🚀 Quick Start (Local Setup)
Prerequisites

Node.js 18+

npm / yarn

MongoDB Atlas account

Clone Repository
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

Access

Frontend: http://localhost:5173

Backend: http://localhost:5000

📦 Deployment
Recommended Setup

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

Refer to:

VERCEL_RENDER_DEPLOYMENT.md

DEPLOYMENT_GUIDE.md

Important checklist

Environment variables configured

VITE_API_URL set in frontend

CORS allows frontend domain

MongoDB Atlas IP whitelist enabled

🔌 API Reference (Sample)
Register User
POST /api/auth/register

Login
POST /api/auth/login

Search Candidates (HR)
POST /api/hr/search

View Candidate Profile
GET /api/hr/candidate/:id

🔐 Test Credentials (Updated)
👩‍💼 HR Portal

Email: zoya3@gmail.com
Password: password123

➡️ Redirects to /hr-dashboard

🎓 Student Login

Email: jaya23@gmail.com
Password: abc@1234

➡️ Redirects to /dashboard

🐛 Troubleshooting
Frontend shows “Server Error”

Verify VITE_API_URL

Check backend deployment status

Inspect Network tab for failed API calls

Confirm CORS configuration

MongoDB issues

Check Atlas connection string

Verify IP whitelist

Confirm DB user credentials

Login problems

Clear browser storage

Verify JWT secret

Ensure user exists in DB

🧭 Future Roadmap

AI-based career recommendations

Resume analysis & feedback

Job matching engine

Email & SMS notifications

Interview preparation modules

Analytics dashboard

Premium plans & payments

🤝 Contributing

Pull requests are welcome.
For major changes, please open an issue first.

📝 License

ISC License

📎 Repository

GitHub: https://github.com/rj25baria/mr-pathfindergit

Status: ✅ Production Ready
Last Updated: February 2026

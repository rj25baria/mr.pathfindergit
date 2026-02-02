# Mr. Pathfinder - Deployment Configuration

This project is ready for deployment on **Vercel** (Frontend) and **Render** (Backend).

## 📋 Current Setup

- **Frontend:** React + Vite (in `/client` folder)
- **Backend:** Express.js + Node.js (in `/server` folder)
- **Database:** MongoDB Atlas (cloud-hosted)
- **API Communication:** CORS-enabled with environment variables

---

## 🚀 Quick Deployment Guide

### 1. **Database Setup (MongoDB Atlas)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free shared cluster
3. Create a database user (save username/password)
4. Allow network access from anywhere (`0.0.0.0/0`)
5. Copy your connection string: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`

---

### 2. **Backend Deployment (Render)**

#### Using Blueprint (Recommended):
1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **New +** → **Blueprint** → Connect GitHub repository
4. Render will automatically detect `render.yaml`
5. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string (e.g., `your-secret-key-here`)
   - `GEMINI_API_KEY`: Your Google Generative AI key (optional)
   - `FRONTEND_URL`: Your Vercel frontend URL (added later)
6. Click **Apply** to deploy

#### Using Manual Setup:
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub repo and configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add the same environment variables above
5. Deploy and copy the service URL (e.g., `https://mr-pathfinder-api.onrender.com`)

---

### 3. **Frontend Deployment (Vercel)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project** → Import GitHub repository
3. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite (auto-detected)
4. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://mr-pathfinder-api.onrender.com`)
5. Click **Deploy**
6. Copy your Vercel URL (e.g., `https://mr-pathfinder.vercel.app`)
7. Update the backend's `FRONTEND_URL` environment variable with this URL

---

## 🔧 Configuration Files

### `render.yaml`
- Defines both backend and frontend services for Render
- Backend: Node.js web service
- Frontend: Static site service (optional, but included)

### `vercel.json`
- Configures Vercel to build from the client directory
- Sets output directory to `client/dist`

### `client/src/config.js`
- Dynamically selects API URL based on environment
- Uses `VITE_API_URL` environment variable in production
- Falls back to `localhost:5000` in development

---

## 🎯 Important Notes

✅ **Backend is CORS-enabled** - frontend can communicate from any origin  
✅ **Environment variables** are properly configured  
✅ **MongoDB Atlas fallback** - in-memory MongoDB for development/testing  
✅ **JWT authentication** - secure token-based auth  
✅ **Contact number field** - added to student registration  
✅ **28 sample students** - includes beginner-friendly and advanced students  

---

## 📊 Database Features

- **Automatic seeding** with 28 test students on first run
- **Demo HR account:** `hr@demo.com` / `password123`
- **Beginner focus:** Students with Diploma/BTech/12th Pass
- **High scorers:** Advanced students with scores 70-92
- **Contact number tracking** for HR visibility

---

## 🔐 Security Considerations

1. **Never commit `.env` files** - use Render/Vercel environment variables
2. **Use strong JWT_SECRET** - generate a random string with at least 32 characters
3. **Enable HTTPS** - both Vercel and Render provide SSL by default
4. **Rotate API keys** - periodically update sensitive keys

---

## 📞 Support & Troubleshooting

If deployment fails:

1. **Check build logs** in Render/Vercel dashboard
2. **Verify environment variables** are set correctly
3. **Test locally first** with `npm run dev` in both client and server
4. **Check MongoDB Atlas** connection string is correct
5. **Review CORS settings** if frontend can't reach backend

---

## ✨ Features Ready for Production

- ✅ User authentication (signup/login)
- ✅ Role-based access (student/HR)
- ✅ HR Dashboard with candidate cards
- ✅ Contact number visibility
- ✅ Candidate search and filtering
- ✅ Profile viewing and editing
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Hot reload in development
- ✅ Production-optimized build

---

**Last Updated:** February 2, 2026
**Repository:** https://github.com/rj25baria/mr.pathfindergit.git

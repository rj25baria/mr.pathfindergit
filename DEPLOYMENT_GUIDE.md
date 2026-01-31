# Mr. Pathfinder Deployment Guide

This guide will walk you through deploying the **Frontend (React)**, **Backend (Node.js/Express)**, and **Database (MongoDB)** for a production-ready application.

---

## 🚀 1. Database Deployment (MongoDB Atlas)

We will use **MongoDB Atlas** for a free, cloud-hosted database.

1.  **Create an Account:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up.
2.  **Create a Cluster:**
    *   Select the **Shared** (Free) plan.
    *   Choose a provider (AWS/Google/Azure) and region close to you.
    *   Click **Create Cluster**.
3.  **Setup User Access:**
    *   Go to **Database Access** -> **Add New Database User**.
    *   Create a username and password (e.g., `admin` / `securepassword123`). **Save these!**
4.  **Setup Network Access:**
    *   Go to **Network Access** -> **Add IP Address**.
    *   Select **Allow Access from Anywhere** (`0.0.0.0/0`) (easiest for deployment).
5.  **Get Connection String:**
    *   Click **Database** -> **Connect** -> **Drivers**.
    *   Copy the connection string (e.g., `mongodb+srv://admin:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`).
    *   Replace `<password>` with your actual password.

---

## ⚙️ 2. Backend Deployment (Render)

We will use **Render** to host the Node.js server.

### Option A: Auto-Deploy with Blueprints (Recommended)
1.  **Push Code to GitHub:** Ensure your project is on GitHub.
2.  **Create Blueprint:**
    *   Go to [Render Dashboard](https://dashboard.render.com/).
    *   Click **New +** -> **Blueprint**.
    *   Connect your GitHub repository.
    *   Render will detect `render.yaml` and auto-configure the service.
3.  **Environment Variables:**
    *   You will be prompted to enter `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, and `FRONTEND_URL`.
4.  **Deploy:** Click **Apply**. Render will automatically build and deploy every time you push to GitHub.

### Option B: Manual Setup
1.  **Push Code to GitHub:** Ensure your project is on GitHub.
2.  **Create Web Service:**
    *   Go to [Render Dashboard](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.
3.  **Configure Service:**
    *   **Root Directory:** `server` (Important! Your backend is in the server folder).
    *   **Runtime:** Node
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
4.  **Environment Variables:**
    *   Scroll down to **Environment Variables** and add:
        *   `MONGO_URI`: (Paste your MongoDB connection string from Step 1)
        *   `JWT_SECRET`: (Enter a long random string, e.g., `mysecretkey123`)
        *   `GEMINI_API_KEY`: (Your Google Gemini API Key)
        *   `FRONTEND_URL`: (We will add this later, or put `*` for now to allow all)
5.  **Deploy:** Click **Create Web Service**.
    *   Wait for it to build. Once done, copy the **Service URL** (e.g., `https://mr-pathfinder-api.onrender.com`).

---

## 🎨 3. Frontend Deployment (Vercel)

We will use **Vercel** to host the React frontend.

1.  **Create Project:**
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **Add New...** -> **Project**.
    *   Import your GitHub repository.
2.  **Configure Project:**
    *   **Root Directory:** Click Edit and select `client`.
    *   **Framework Preset:** Vite (should auto-detect).
3.  **Environment Variables:**
    *   Add the following variable:
        *   `VITE_API_URL`: (Paste your Render Backend URL from Step 2, e.g., `https://mr-pathfinder-api.onrender.com`)
4.  **Deploy:** Click **Deploy**.
    *   Wait for the build. Once done, you will get a **Domain** (e.g., `https://mr-pathfinder.vercel.app`).

---

## 🔑 5. How to Get Your API Keys

### **1. JWT_SECRET (For Security)**
This is a password your server uses to sign login tokens. You can use any long, random string.
*   **Option A (Quick):** Copy this one I generated for you:
    `d41d8cd98f00b204e9800998ecf8427e_MakeSureToChangeThisToSomethingRandom`
*   **Option B (Secure):** Go to [RandomKeygen](https://randomkeygen.com/) and copy a "CodeIgniter Encryption Key".

### **2. GEMINI_API_KEY (For AI Features)**
This is required for the AI to generate custom roadmaps.
1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Sign in with your Google Account.
3.  Click **Create API Key**.
4.  Copy the key (starts with `AIza...`).
    *   *Note: If you skip this, the app will use "Smart Fallback" mode and generate roadmaps using pre-set templates instead of real AI.*

---

## 🔗 6. Final Connection Steps

Now that both sides are up, we need to link them securely.

1.  **Update Backend CORS:**
    *   Go back to **Render** -> Your Backend Service -> **Environment Variables**.
    *   Add/Update `FRONTEND_URL` with your **Vercel Domain** (e.g., `https://mr-pathfinder.vercel.app`).
    *   Render will auto-redeploy.

2.  **Test the Application:**
    *   Open your Vercel URL.
    *   Try to **Sign Up** (This tests Database + Backend connection).
    *   Try to **Generate Roadmap** (Tests AI integration).

---

## ✅ Current Project Status

### **Frontend**
*   **Framework:** React + Vite
*   **Status:** Production Ready
*   **Key Features:**
    *   Modern Landing Page (Animated Tabs, Feedback Form).
    *   Student Dashboard (Roadmaps, Progress Tracking, Gamification).
    *   HR Dashboard (Candidate Search).
    *   Authentication (Login/Signup/Logout).

### **Backend**
*   **Framework:** Node.js + Express
*   **Status:** Production Ready
*   **Database:** MongoDB (with Mongoose).
*   **Features:**
    *   REST API for Auth, Roadmaps, and HR.
    *   Smart AI Fallback (Works even if Gemini fails).
    *   CORS configured for production.

### **Database**
*   **Type:** MongoDB
*   **Status:** Schema defined (Users, Roadmaps).
*   **Next Step:** Connect to MongoDB Atlas (Cloud) using the guide above.

---

## 🛠️ Troubleshooting Common Errors

### **Error: `npm error Missing script: "start"` on Render**
*   **Cause:** Render is trying to run the server from the main folder instead of the `server` folder.
*   **Fix:**
    1.  Go to your **Render Dashboard**.
    2.  Click on your **Web Service**.
    3.  Click **Settings** on the left side.
    4.  Scroll down to **Build & Deploy**.
    5.  Find **Root Directory**.
    6.  Click **Edit** and change it to: `server`.
    7.  Click **Save Changes**. (Render will automatically redeploy).


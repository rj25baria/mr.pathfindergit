import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/Auth'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const RoadmapForm = lazy(() => import('./pages/RoadmapForm'));
const HRDashboard = lazy(() => import('./pages/HRDashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  // Use VITE_BASENAME env var if set, otherwise default to '/'
  // If deploying to GitHub Pages, set VITE_BASENAME='/mr.pathfinder' in .env.production
  const basename = import.meta.env.VITE_BASENAME || '/';
  
  return (
    <Router basename={basename}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-bold text-indigo-600 animate-pulse">Loading Mr. Pathfinder...</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/generate" element={<RoadmapForm />} />
              <Route path="/hr-dashboard" element={<HRDashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
        </div>
      </div>
      <Analytics />
    </Router>
  );
}

export default App;

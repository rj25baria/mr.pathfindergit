import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import StudentDashboard from './pages/StudentDashboard';
import RoadmapForm from './pages/RoadmapForm';
import HRDashboard from './pages/HRDashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router basename="/mr.pathfinder">
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/generate" element={<RoadmapForm />} />
            <Route path="/hr-dashboard" element={<HRDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

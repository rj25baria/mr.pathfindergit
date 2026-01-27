import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Brain, Code, Target, BookOpen, Clock } from 'lucide-react';
import { API_URL } from '../config';

const RoadmapForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    education: 'Undergraduate',
    interests: '',
    skillLevel: 'Beginner',
    careerGoal: '',
    hoursPerWeek: '10'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/roadmap/generate`, formData, { withCredentials: true });
      if (res.data.success) {
        toast.success('Roadmap generated successfully! 🚀');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/auth');
      } else {
        toast.error(err.response?.data?.message || 'Failed to generate roadmap. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-4 md:p-8 rounded-xl shadow-md border border-gray-100 mt-4 md:mt-8">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">Create Your Career Roadmap</h2>
        <p className="text-gray-600 mt-2">Mr. Pathfinder's AI will analyze your profile and build a custom plan.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 text-gray-400" size={20} />
              <select name="education" onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="10th pass">10th Pass</option>
                <option value="12th pass">12th Pass</option>
                <option value="Diploma">Diploma</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Skill Level</label>
            <div className="relative">
              <Brain className="absolute left-3 top-3 text-gray-400" size={20} />
              <select name="skillLevel" onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Interest / Track</label>
            <div className="relative">
              <Code className="absolute left-3 top-3 text-gray-400" size={20} />
              <select name="interests" onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" required>
                <option value="">Select a Track</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Data Science">Data Science</option>
                <option value="Web Development">Web Development</option>
                <option value="App Development">App Development</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="DevOps">DevOps</option>
                <option value="Cloud Computing">Cloud Computing</option>
              </select>
            </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Hours Per Week</label>
             <div className="relative">
               <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
               <input name="hoursPerWeek" type="number" min="1" max="100" placeholder="e.g. 10" onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />
             </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Career Goal</label>
          <div className="relative">
            <Target className="absolute left-3 top-3 text-gray-400" size={20} />
            <input name="careerGoal" placeholder="e.g., AI Engineer, Full Stack Developer" onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition flex justify-center items-center">
          {loading ? 'Generating Path...' : 'Generate Roadmap'}
        </button>
      </form>
    </div>
  );
};

export default RoadmapForm;

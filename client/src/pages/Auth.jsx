import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://mr-pathfinder.onrender.com"; // Render backend URL

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student',
    education: 'Undergraduate', interests: '', skillLevel: 'Beginner', careerGoal: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      // Call Render backend instead of localhost
      const res = await axios.post(`${API_URL}${endpoint}`, formData, { withCredentials: true });
      
      if (res.data.success) {
        if (res.data.user.role === 'hr') navigate('/hr-dashboard');
        else navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-900">{isLogin ? 'Login' : 'Join Mr. Pathfinder'}</h2>
      
      <div className="flex mb-6 border-b">
        <button onClick={() => setIsLogin(true)} className={`flex-1 pb-2 ${isLogin ? 'border-b-2 border-indigo-600 font-bold' : 'text-gray-500'}`}>Login</button>
        <button onClick={() => setIsLogin(false)} className={`flex-1 pb-2 ${!isLogin ? 'border-b-2 border-indigo-600 font-bold' : 'text-gray-500'}`}>Sign Up</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-3 border rounded" required />
            <select name="role" onChange={handleChange} className="w-full p-3 border rounded">
              <option value="student">Student</option>
              <option value="hr">HR / Recruiter</option>
            </select>
            {formData.role === 'student' && (
              <>
                <select name="education" onChange={handleChange} className="w-full p-3 border rounded">
                  <option value="10th pass">10th Pass</option>
                  <option value="12th pass">12th Pass</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Other">Other</option>
                </select>
                <input name="interests" placeholder="Interests (e.g. AI, Web Dev)" onChange={handleChange} className="w-full p-3 border rounded" />
                <select name="skillLevel" onChange={handleChange} className="w-full p-3 border rounded">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <input name="careerGoal" placeholder="Career Goal (e.g. AI Engineer)" onChange={handleChange} className="w-full p-3 border rounded" />
              </>
            )}
          </>
        )}
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border rounded" required />
        
        <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded font-bold hover:bg-indigo-700 transition">
          {isLogin ? 'Login' : 'Get Started'}
        </button>
      </form>
    </div>
  );
};

export default Auth;

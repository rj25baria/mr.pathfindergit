import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    education: 'Undergraduate',
    interests: '',
    skillLevel: 'Beginner',
    careerGoal: ''
  });

  const navigate = useNavigate();

  // Update form data on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit for login/signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      // Make API call to backend
      const res = await axios.post(`${API_URL}${endpoint}`, formData, { withCredentials: true });

      if (res.data.success) {
        // Redirect based on role
        if (res.data.user.role === 'hr') navigate('/hr-dashboard');
        else navigate('/dashboard');
      }
    } catch (err) {
      // Show backend error or fallback message
      alert(err.response?.data?.message || 'Error connecting to server');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-900">
        {isLogin ? 'Login' : 'Join Mr. Pathfinder'}
      </h2>

      {/* Toggle Login / Sign Up */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 pb-2 ${
            isLogin ? 'border-b-2 border-indigo-600 font-bold' : 'text-gray-500'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 pb-2 ${
            !isLogin ? 'border-b-2 border-indigo-600 font-bold' : 'text-gray-500'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
            <select
              name="role"
              onChange={handleChange}
              className="w-full p-3 border rounded"
            >
              <option value="student">Student</option>
              <option value="hr">HR / Recruiter</option>
            </select>

            {formData.role === 'student' && (
              <>
                <select
                  name="education"
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                >
                  <option value="10th pass">10th Pass</option>
                  <option value="12th pass">12th Pass</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                </select>

                <input
                  name="interests"
                  placeholder="Interests (e.g. AI, Web Dev)"
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                />

                <select
                  name="skillLevel"
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <input
                  name="careerGoal"
                  placeholder="Career Goal"
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                />
              </>
            )}
          </>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <button 
          disabled={loading}
          className={`w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 font-bold transition flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            isLogin ? 'Login' : 'Sign Up'
          )}
        </button>
      </form>
    </div>
  );
};

export default Auth;
};

export default Auth;

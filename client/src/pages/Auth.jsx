import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { INTEREST_OPTIONS } from '../data/constants';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', // Default role
    education: '10th pass', // Default education
    interests: 'Artificial Intelligence', // Default interest
    careerGoal: '',
    skillLevel: 'Beginner',
    hoursPerWeek: 10
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
      const res = await api.post(endpoint, formData);

      if (res.data.success) {
        if (!isLogin) {
          // Signup successful
          toast.success('Account created! Please login.');
          setIsLogin(true);
          return;
        }

        // Login successful
        // Save token to localStorage for cross-origin persistence
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          // Store user info (especially role) for UI logic
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        
        toast.success(`Welcome back, ${res.data.user.name}!`);
        // Redirect based on role
        if (res.data.user.role === 'hr') navigate('/hr-dashboard');
        else navigate('/dashboard');
      }
    } catch (err) {
      // Show backend error or fallback message
      toast.error(err.response?.data?.message || 'Error connecting to server');
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
              autoComplete="name"
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
            
            {/* Role Selection */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            >
              <option value="student">Student</option>
              <option value="hr">HR/Recruiter</option>
            </select>

            {/* Student Specific Fields */}
            {formData.role === 'student' && (
              <>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                >
                  <option value="10th pass">10th Pass</option>
                  <option value="12th pass">12th Pass</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>

                <select
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                >
                  <option value="" disabled>Select Primary Interest</option>
                  {INTEREST_OPTIONS.map((interest) => (
                    <option key={interest} value={interest}>{interest}</option>
                  ))}
                </select>

                <input
                  name="careerGoal"
                  placeholder="Dream Job / Career Goal"
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                  required
                />
              </>
            )}
          </>
        )}
        
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          autoComplete="email"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
          {isLogin && (
            <div className="text-right mt-1">
              <button 
                type="button" 
                onClick={() => toast('Password reset link sent to your email!', { icon: '📧' })}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded font-bold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
        </button>
      </form>
    </div>
  );
};

export default Auth;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

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
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Professional">Professional</option>
                </select>
                <input
                  name="interests"
                  placeholder="Interests (comma separated)"
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                />
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
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
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

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          type="button"
          onClick={() => toast('Google Login coming soon!', { icon: '🤖' })}
          className="w-full border border-gray-300 text-gray-700 p-3 rounded font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
      </form>
    </div>
  );
};

export default Auth;

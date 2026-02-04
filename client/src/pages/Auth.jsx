import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { INTEREST_OPTIONS } from '../data/constants';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Clean Initial State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    contactNumber: '',
    password: '',
    dateOfBirth: '',
    role: 'student',
    
    // Student Optionals
    education: '10th Pass',
    interests: 'Artificial Intelligence',
    careerGoal: '',
    
    // Security
    consent: false,
    captchaAnswer: ''
  });

  const [captcha, setCaptcha] = useState({ q: '2 + 2', a: 4 });

  useEffect(() => {
    generateCaptcha();
  }, [isLogin]);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    setCaptcha({ q: `${n1} + ${n2}`, a: n1 + n2 });
    setFormData(prev => ({ ...prev, captchaAnswer: '' }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- VALIDATION ---
    if (formData.password.length < 6) {
        return toast.error('Password must be at least 6 characters');
    }

    if (!isLogin) {
        // Strict checks for Signup
        if (!formData.name.trim()) return toast.error('Name is required');
        if (!formData.phone.trim()) return toast.error('Phone number is required');
        if (!formData.dateOfBirth) return toast.error('Date of Birth is required');
        
        const phoneClean = formData.phone.replace(/\D/g, '');
        if (phoneClean.length !== 10) {
            return toast.error('Phone number must be exactly 10 digits');
        }

        // Optional alternate contact validation
        if (formData.contactNumber && formData.contactNumber.trim()) {
            const contactClean = formData.contactNumber.replace(/\D/g, '');
            if (contactClean.length !== 10) {
                return toast.error('Contact number must be exactly 10 digits');
            }
        }

        if (formData.role === 'student' && !formData.consent) {
            return toast.error('Please agree to the Terms and Conditions');
        }
        
        if (parseInt(formData.captchaAnswer) !== captcha.a) {
             toast.error('Wrong CAPTCHA Answer');
             generateCaptcha();
             return;
        }
    }

    // --- API CALL ---
    setLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const loader = toast.loading('Processing...');

    try {
        const res = await api.post(endpoint, formData);
        
        if (res.data.success) {
            if (isLogin) {
                // Login flow - redirect to dashboard
                toast.success('Login Successful', { id: loader });
                
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                }

                setTimeout(() => {
                    const target = res.data.user.role === 'hr' ? '/hr-dashboard' : '/dashboard';
                    navigate(target);
                }, 1000);
            } else {
                // Signup flow - redirect to login page
                toast.success('Account Created! Please login with your credentials.', { id: loader });
                
                setTimeout(() => {
                    setIsLogin(true);
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        contactNumber: '',
                        password: '',
                        dateOfBirth: '',
                        role: 'student',
                        education: '10th Pass',
                        interests: 'Artificial Intelligence',
                        careerGoal: '',
                        consent: false,
                        captchaAnswer: ''
                    });
                }, 1000);
            }
        }
    } catch (err) {
        console.error('Signup Error:', err);
        
        let errorMsg = 'Server Error';
        
        if (!err.response) {
            // Network Error (CORS or Offline)
            errorMsg = 'Network Error: Cannot reach server. Please check your connection.';
        } else if (err.response.status === 404) {
            // Wrong API URL
            errorMsg = 'Error 404: API Endpoint not found. Please contact support.';
        } else if (err.response.data?.message) {
            // Backend Error Message
            errorMsg = err.response.data.message;
        }

        toast.error(errorMsg, { id: loader });
        
        if (!isLogin) generateCaptcha();
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
            {/* Header */}
            <div className="bg-indigo-600 p-6 text-center">
                <h2 className="text-3xl font-extrabold text-white">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-indigo-200 mt-2">Mr. Pathfinder Career Portal</p>
            </div>

            {/* Toggle */}
            <div className="flex border-b border-gray-100">
                <button 
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-4 font-bold text-sm uppercase tracking-wide transition ${isLogin ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
                >
                    Login
                </button>
                <button 
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-4 font-bold text-sm uppercase tracking-wide transition ${!isLogin ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
                >
                    Sign Up
                </button>
            </div>

            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Build Timestamp: 2026-02-02 Emergency Fix v2 */}
                    
                    {/* --- SIGN UP FIELDS --- */}
                    {!isLogin && (
                        <>
                            {/* 1. Personal Info */}
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700">Personal Information</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="col-span-2 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        required
                                    />
                                    <input 
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="col-span-2 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        required
                                    />
                                    
                                    {/* PHONE NUMBER - EXPLICITLY HERE */}
                                    <div className="col-span-1">
                                        <label className="text-xs font-bold text-indigo-600 uppercase mb-1 block">Mobile Number</label>
                                        <input 
                                            name="phone"
                                            type="tel"
                                            placeholder="e.g. 9876543210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium"
                                            maxLength={10}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <label className="text-xs font-bold text-indigo-600 uppercase mb-1 block">Contact Number (Optional)</label>
                                        <input 
                                            name="contactNumber"
                                            type="tel"
                                            placeholder="Alternate contact"
                                            value={formData.contactNumber}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            maxLength={10}
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <label className="text-xs text-gray-500 mb-1 block">Date of Birth</label>
                                        <input 
                                            name="dateOfBirth"
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-xs text-gray-500 mb-1 block">Role</label>
                                        <select 
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                        >
                                            <option value="student">Student</option>
                                            <option value="hr">HR/Recruiter</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Student Details */}
                            {formData.role === 'student' && (
                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <label className="block text-sm font-bold text-gray-700">Education & Goals</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <select 
                                            name="education"
                                            value={formData.education}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                        >
                                            <option value="10th Pass">10th Pass</option>
                                            <option value="12th Pass">12th Pass</option>
                                            <option value="Diploma">Diploma</option>
                                            <option value="Undergraduate">Undergraduate</option>
                                            <option value="Post Graduate">Post Graduate</option>
                                        </select>
                                        
                                        <select 
                                            name="interests"
                                            value={formData.interests}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                        >
                                            {INTEREST_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                                        </select>

                                        <input 
                                            name="careerGoal"
                                            placeholder="Dream Job (e.g. AI Engineer)"
                                            value={formData.careerGoal}
                                            onChange={handleChange}
                                            className="col-span-2 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* --- LOGIN FIELDS --- */}
                    {isLogin && (
                        <div className="space-y-4">
                             <input 
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                required
                            />
                        </div>
                    )}

                    {/* --- SHARED PASSWORD --- */}
                    <input 
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        required
                    />

                    {/* --- FORGOT PASSWORD (LOGIN ONLY) --- */}
                    {isLogin && (
                        <div className="text-right">
                            <a 
                                href="mailto:support@mrpathfinder.com?subject=Password Reset Request"
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition"
                            >
                                Forgot Password?
                            </a>
                        </div>
                    )}

                    {/* --- CAPTCHA & CONSENT --- */}
                    {!isLogin && (
                        <div className="bg-indigo-50 p-4 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-indigo-900">Security Check: {captcha.q}</label>
                                <input 
                                    name="captchaAnswer"
                                    type="number"
                                    placeholder="?"
                                    value={formData.captchaAnswer}
                                    onChange={handleChange}
                                    className="w-20 p-2 text-center font-bold border rounded outline-none"
                                    required
                                />
                            </div>
                            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="consent"
                                    checked={formData.consent}
                                    onChange={handleChange}
                                    className="mt-1"
                                    required
                                />
                                I agree to the <span className="text-indigo-600 font-bold underline">Terms & Conditions</span>
                            </label>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold p-4 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition transform active:scale-95"
                    >
                        {loading ? 'Wait...' : (isLogin ? 'Login Now' : 'Create Account')}
                    </button>
                    
                </form>
            </div>
        </div>
    </div>
  );
};

export default Auth;

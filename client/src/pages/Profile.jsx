import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { User, Mail, BookOpen, Target, Brain, Award, Flame, Calendar, Edit2, Phone, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data.data);
      setFormData({
        name: res.data.data.name,
        phone: res.data.data.phone || '',
        education: res.data.data.education || '',
        careerGoal: res.data.data.careerGoal || '',
        skillLevel: res.data.data.skillLevel || 'Beginner'
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load profile');
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put('/api/auth/profile', formData);
      setUser(res.data.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-white flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white p-1 rounded-full">
             <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
               <User size={64} />
             </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <div className="flex flex-col gap-1 mt-2">
              <p className="opacity-90 flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> {user.email}
              </p>
              <p className="opacity-90 flex items-center justify-center md:justify-start gap-2">
                <Phone size={16} /> 
                {isEditing ? (
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="text-gray-900 text-sm rounded px-2 py-1 w-40"
                    placeholder="Phone Number"
                  />
                ) : (
                  user.phone || <span className="text-white/60 italic text-sm">Add phone number</span>
                )}
              </p>
            </div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center backdrop-blur-sm">
             <p className="text-xs uppercase font-bold opacity-80">Readiness Score</p>
             <p className="text-4xl font-extrabold">{user.readinessScore}</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
               <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                 <Flame size={24} />
               </div>
               <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">Current Streak</p>
                 <p className="text-xl font-bold text-gray-900">{user.streak} Days</p>
               </div>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
               <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                 <Award size={24} />
               </div>
               <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">Badges Earned</p>
                 <p className="text-xl font-bold text-gray-900">{user.badges ? user.badges.length : 0}</p>
               </div>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
               <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                 <Calendar size={24} />
               </div>
               <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">Member Since</p>
                 <p className="text-xl font-bold text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
               </div>
             </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="text-indigo-600" /> Career Info
              </h3>
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Career Goal</p>
                  {isEditing ? (
                    <input 
                      type="text"
                      name="careerGoal"
                      value={formData.careerGoal}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1 mt-1"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900">{user.careerGoal || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Education</p>
                  {isEditing ? (
                    <input 
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1 mt-1"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900">{user.education || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skill Level</p>
                  {isEditing ? (
                    <select 
                      name="skillLevel"
                      value={formData.skillLevel}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1 mt-1"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  ) : (
                    <p className="font-semibold text-gray-900">{user.skillLevel || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Brain className="text-indigo-600" /> Interests & Skills
              </h3>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex flex-wrap gap-2">
                  {user.interests && user.interests.length > 0 ? (
                    user.interests.map((int, i) => (
                      <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                        {int}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No interests added yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100 text-center">
             {isEditing ? (
               <div className="flex justify-center gap-4">
                 <button 
                   onClick={handleUpdate}
                   className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2"
                 >
                   <Save size={18} /> Save Changes
                 </button>
                 <button 
                   onClick={() => setIsEditing(false)}
                   className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
                 >
                   Cancel
                 </button>
               </div>
             ) : (
               <p className="text-gray-500 text-sm">Want to update your profile? <span className="text-indigo-600 font-bold cursor-pointer hover:underline" onClick={() => setIsEditing(true)}>Edit Profile</span></p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Search, Briefcase, User, Star, X, Mail, Flame, Award, Calendar, CheckCircle, XCircle, Trash2, Phone, Edit2, Save, RefreshCw } from 'lucide-react';

const HRDashboard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [filters, setFilters] = useState({ skill: '', minScore: '' });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, ready: 0, streak: 0 });
  const [alerts, setAlerts] = useState([]);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    fetchCandidates();
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/api/hr/alerts');
      setAlerts(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch alerts', err?.response?.data || err);
    }
  };

  useEffect(() => {
    if (selectedCandidate) {
      setPhoneInput(selectedCandidate.phone || '');
      setEmailInput(selectedCandidate.email || '');
      setIsEditingPhone(false);
      setIsEditingEmail(false);
    }
  }, [selectedCandidate]);

  const fetchCandidates = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/api/hr/search', { params });
      
      // Remove duplicates based on email
      const uniqueCandidates = [...new Map(res.data.data.map(item => [item.email, item])).values()];
      
      // Sort candidates by readinessScore (Descending)
      const sortedCandidates = uniqueCandidates.sort((a, b) => b.readinessScore - a.readinessScore);
      setCandidates(sortedCandidates);

      // Calculate Stats
      const total = sortedCandidates.length;
      const ready = sortedCandidates.filter(c => c.readinessScore >= 70).length;
      const topStreak = Math.max(...sortedCandidates.map(c => c.streak || 0), 0);
      setStats({ total, ready, streak: topStreak });

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this candidate? This action cannot be undone.')) return;
    
    const previousCandidates = [...candidates];
    setCandidates(prev => prev.filter(c => c._id !== id));
    setStats(prev => ({ ...prev, total: prev.total - 1 }));

    try {
      await api.delete(`/api/hr/candidate/${id}`);
      toast.success('Candidate removed successfully');
      if (selectedCandidate?._id === id) setSelectedCandidate(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove candidate');
      setCandidates(previousCandidates);
      setStats(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCandidates(filters);
  };

  const handleSaveEmail = async () => {
    if (!emailInput || !emailInput.includes('@')) {
        toast.error('Enter valid email');
        return;
    }
    try {
        const res = await api.put(`/api/hr/candidate/${selectedCandidate._id}`, { email: emailInput });
        if (res.data.success) {
            toast.success('Email updated');
            setSelectedCandidate({ ...selectedCandidate, email: emailInput });
            setCandidates(candidates.map(c => c._id === selectedCandidate._id ? { ...c, email: emailInput } : c));
            setIsEditingEmail(false);
        }
    } catch (err) {
        toast.error('Failed to update email');
    }
  };

  const handleSavePhone = async () => {
    if (!phoneInput || phoneInput.length < 10) {
      toast.error('Enter valid phone number');
      return;
    }
    try {
      const res = await api.put(`/api/hr/candidate/${selectedCandidate._id}`, { phone: phoneInput });
      if (res.data.success) {
        toast.success('Phone updated');
        setSelectedCandidate({ ...selectedCandidate, phone: phoneInput });
        setCandidates(candidates.map(c => c._id === selectedCandidate._id ? { ...c, phone: phoneInput } : c));
        setIsEditingPhone(false);
      }
    } catch (err) {
      toast.error('Failed to update phone');
    }
  };

  const handleResetSystem = async () => {
    if (!window.confirm('⚠️ EMERGENCY RESET\n\nThis will DELETE all current candidates and restore the original 13 sample candidates.\n\nAre you sure?')) return;
    
    setLoading(true);
    try {
        const res = await api.post('/api/hr/reset');
        if (res.data.success) {
            toast.success('System Reset Complete: 13 Candidates Restored');
            fetchCandidates();
        }
    } catch (err) {
        console.error(err);
        toast.error('Reset Failed');
    } finally {
        setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 86) return 'bg-green-100 text-green-800';
    if (score >= 71) return 'bg-blue-100 text-blue-800';
    if (score >= 41) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-8 relative">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-sm font-bold uppercase">Total Candidates</p>
             <h2 className="text-3xl font-extrabold text-gray-900 mt-1">{stats.total}</h2>
           </div>
           <div className="bg-indigo-50 p-3 rounded-full text-indigo-600">
             <User size={32} />
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-sm font-bold uppercase">Job Ready (&gt;70%)</p>
             <h2 className="text-3xl font-extrabold text-green-600 mt-1">{stats.ready}</h2>
           </div>
           <div className="bg-green-50 p-3 rounded-full text-green-600">
             <CheckCircle size={32} />
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-sm font-bold uppercase">Top Streak</p>
             <h2 className="text-3xl font-extrabold text-orange-500 mt-1">{stats.streak} Days</h2>
           </div>
           <div className="bg-orange-50 p-3 rounded-full text-orange-600">
             <Flame size={32} />
           </div>
        </div>
      </div>

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-6 flex justify-between items-start text-white">
              <div>
                <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                <p className="opacity-90 flex items-center gap-2">
                    <Mail size={16} /> 
                    {isEditingEmail ? (
                        <div className="flex items-center gap-2">
                            <input 
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="text-black text-sm p-1 rounded w-48"
                                placeholder="Email..."
                                autoFocus
                            />
                            <button onClick={handleSaveEmail} className="bg-green-500 p-1 rounded hover:bg-green-600" title="Save">
                                <Save size={14} />
                            </button>
                            <button onClick={() => setIsEditingEmail(false)} className="bg-red-500 p-1 rounded hover:bg-red-600" title="Cancel">
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group">
                            {selectedCandidate.email}
                            <button 
                                onClick={() => setIsEditingEmail(true)} 
                                className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-white/20 rounded"
                                title="Edit Email"
                            >
                                <Edit2 size={12} />
                            </button>
                        </div>
                    )}
                </p>
                <p className="opacity-90 flex items-center gap-2 mt-1">
                  <Phone size={16} /> 
                  {isEditingPhone ? (
                    <div className="flex items-center gap-2">
                        <input 
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            className="text-black text-sm p-1 rounded w-32"
                            placeholder="Phone..."
                            autoFocus
                        />
                        <button onClick={handleSavePhone} className="bg-green-500 p-1 rounded hover:bg-green-600" title="Save">
                            <Save size={14} />
                        </button>
                        <button onClick={() => setIsEditingPhone(false)} className="bg-red-500 p-1 rounded hover:bg-red-600" title="Cancel">
                            <X size={14} />
                        </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                        {selectedCandidate.phone ? (
                            <a href={`tel:${selectedCandidate.phone}`} className="hover:underline text-white font-medium">
                            {selectedCandidate.phone}
                            </a>
                        ) : <span className="italic opacity-75">No phone provided</span>}
                        
                        <button 
                            onClick={() => setIsEditingPhone(true)} 
                            className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-white/20 rounded"
                            title="Edit Phone Number"
                        >
                            <Edit2 size={12} />
                        </button>
                    </div>
                  )}
                </p>
                <p className="opacity-90 flex items-center gap-2 mt-1 text-sm">
                  <Phone size={14} /> 
                  <span className="font-semibold">Alternate:</span> {selectedCandidate.contactNumber || 'Not provided'}
                </p>
                <p className="text-sm opacity-75 mt-1 flex items-center gap-2"><Briefcase size={16} /> {selectedCandidate.education || 'Education not specified'}</p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="hover:bg-indigo-700 p-1 rounded transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Stats Row */}
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Readiness Score</p>
                  <p className={`text-3xl font-extrabold ${getScoreColor(selectedCandidate.readinessScore).split(' ')[1]}`}>
                    {selectedCandidate.readinessScore}
                  </p>
                </div>
                <div className="h-10 w-px bg-gray-300"></div>
                <div className="text-center">
                   <p className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1 justify-center">
                     <Flame size={14} className="text-orange-500" /> Streak
                   </p>
                   <p className="text-2xl font-bold text-gray-800">{selectedCandidate.streak || 0} Days</p>
                </div>
                <div className="h-10 w-px bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Last Active</p>
                  <p className="text-sm font-medium text-gray-700">
                    {selectedCandidate.lastActivity ? new Date(selectedCandidate.lastActivity).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="text-yellow-500" /> Earned Badges
                </h3>
                {selectedCandidate.badges && selectedCandidate.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {selectedCandidate.badges.map((badge, idx) => (
                      <span key={idx} className="bg-yellow-50 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                        <Star size={14} fill="currentColor" /> {badge.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No badges earned yet.</p>
                )}
              </div>

              {/* Goal & Interests */}
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <h3 className="font-bold text-gray-900 mb-2">Career Goal</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedCandidate.careerGoal}</p>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 mb-2">Top Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.interests.map((int, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded border border-indigo-100">{int}</span>
                      ))}
                    </div>
                 </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4">
                <a 
                  href={`mailto:${selectedCandidate.email}`}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 min-w-[140px]"
                >
                  <Mail size={18} /> Send Email
                </a>
                
                {selectedCandidate.phone ? (
                  <a 
                    href={`tel:${selectedCandidate.phone}`}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 min-w-[140px]"
                  >
                    <Phone size={18} /> Call Now
                  </a>
                ) : (
                  <button 
                    disabled
                    className="flex-1 bg-gray-100 text-gray-400 py-3 rounded-lg font-bold cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                    title="No phone number provided"
                  >
                    <Phone size={18} /> No Phone
                  </button>
                )}

                <button
                    onClick={() => handleDelete(selectedCandidate._id)}
                    className="bg-red-50 text-red-600 px-4 py-3 rounded-lg font-bold hover:bg-red-100 transition flex items-center justify-center gap-2 border border-red-200"
                >
                    <Trash2 size={18} /> Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Briefcase className="text-indigo-600" /> Candidate Search
        </h1>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Skill or Interest (e.g. React, Python)" 
              className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={filters.skill}
              onChange={(e) => setFilters({...filters, skill: e.target.value})}
            />
          </div>
          <div className="w-full md:w-48">
            <input 
              type="number" 
              placeholder="Min Score" 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={filters.minScore}
              onChange={(e) => setFilters({...filters, minScore: e.target.value})}
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Find Talent
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Searching for top talent...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No Candidates Found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters to find more students.</p>
          <button 
            onClick={handleResetSystem}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={18} />
            Load Sample Candidates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div key={candidate._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition transform hover:scale-105">
              {/* Card Header with Score Badge */}
              <div className="relative p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-100">
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(candidate.readinessScore)}`}>
                    Score: {candidate.readinessScore}
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-600 p-3 rounded-full text-white">
                    <User size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.education || 'Education not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                {/* Email */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">EMAIL</p>
                  <a href={`mailto:${candidate.email}`} className="text-sm text-indigo-600 hover:underline break-all">
                    {candidate.email}
                  </a>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">PHONE</p>
                  {candidate.phone ? (
                    <a href={`tel:${candidate.phone}`} className="text-sm text-indigo-600 hover:underline font-medium">
                      {candidate.phone}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Not provided</p>
                  )}
                </div>

                {/* Contact Number */}
                {candidate.contactNumber && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">ALTERNATE</p>
                    <p className="text-sm text-gray-700 font-medium">{candidate.contactNumber}</p>
                  </div>
                )}

                {/* Career Goal */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">CAREER GOAL</p>
                  <p className="text-sm text-gray-700">{candidate.careerGoal || 'Not specified'}</p>
                </div>

                {/* Interests */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">INTERESTS</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.interests && candidate.interests.length > 0 ? (
                      candidate.interests.map((interest, idx) => (
                        <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full border border-indigo-100">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">No interests specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer with Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => setSelectedCandidate(candidate)}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition text-sm"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleDelete(candidate._id)}
                  className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition"
                  title="Remove candidate"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HRDashboard;

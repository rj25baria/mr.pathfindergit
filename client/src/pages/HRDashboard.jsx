import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Briefcase, User, Star, X, Mail, Flame, Award, Calendar } from 'lucide-react';
import { API_URL } from '../config';

const HRDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [filters, setFilters] = useState({ skill: '', minScore: '' });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axios.get(`${API_URL}/api/hr/search?${query}`, {
        withCredentials: true
      });
      setCandidates(res.data.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCandidates(filters);
  };

  const getScoreColor = (score) => {
    if (score >= 86) return 'bg-green-100 text-green-800';
    if (score >= 71) return 'bg-blue-100 text-blue-800';
    if (score >= 41) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-8 relative">
      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-6 flex justify-between items-start text-white">
              <div>
                <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                <p className="opacity-90">{selectedCandidate.education}</p>
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
              <div className="pt-4 border-t border-gray-100 flex gap-4">
                <a 
                  href={`mailto:${selectedCandidate.email}`}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <Mail size={18} /> {selectedCandidate.email}
                </a>
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
              placeholder="Min Readiness Score" 
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
          <p className="text-gray-500">Try adjusting your filters to find more students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{candidate.name}</h3>
                  <p className="text-sm text-gray-500">{candidate.education}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(candidate.readinessScore)}`}>
                Score: {candidate.readinessScore}
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                <p className="text-gray-800 text-sm truncate" title={candidate.email}>{candidate.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Career Goal</p>
                <p className="text-gray-800">{candidate.careerGoal}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Interests</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {candidate.interests.map((int, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{int}</span>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedCandidate(candidate)}
              className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition flex items-center justify-center gap-2"
            >
              <Star size={16} /> View Profile
            </button>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default HRDashboard;

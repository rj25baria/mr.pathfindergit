import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Circle, ExternalLink, Award, TrendingUp, Flame, Star, Calendar, Briefcase, Hammer } from 'lucide-react';
import { API_URL } from '../config';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissionModal, setSubmissionModal] = useState({ show: false, projectId: null, link: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
      setUser(userRes.data.data);
      
      const roadmapRes = await axios.get(`${API_URL}/api/roadmap/my-roadmap`, { withCredentials: true });
      // Backend now returns { count: N, data: [...] }
      const roadmapData = roadmapRes.data.data;
      setRoadmaps(roadmapData);
      if (roadmapData.length > 0) {
        setActiveRoadmap(roadmapData[0]);
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProgress = async (itemId, type, currentStatus, submissionLink = null) => {
    if (!activeRoadmap) return;
    
    // If it's a project and not completed, require submission link
    if (type === 'project' && !currentStatus && !submissionLink) {
        setSubmissionModal({ show: true, projectId: itemId, link: '' });
        return;
    }

    try {
      const res = await axios.put(`${API_URL}/api/roadmap/progress`, {
        roadmapId: activeRoadmap._id,
        itemId,
        type,
        completed: !currentStatus,
        submissionLink
      }, { withCredentials: true });
      
      // Update the active roadmap in the list
      const updatedRoadmap = res.data.data;
      setActiveRoadmap(updatedRoadmap);
      setRoadmaps(prev => prev.map(r => r._id === updatedRoadmap._id ? updatedRoadmap : r));

      setUser(prev => ({ 
        ...prev, 
        readinessScore: res.data.readinessScore,
        streak: res.data.streak,
        badges: res.data.badges
      }));
      
      // Close modal if open
      setSubmissionModal({ show: false, projectId: null, link: '' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error updating progress');
    }
  };

  const submitProject = (e) => {
      e.preventDefault();
      handleProgress(submissionModal.projectId, 'project', false, submissionModal.link);
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  if (roadmaps.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">No Roadmap Found</h2>
        <Link to="/generate" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold">Generate Your First Roadmap</Link>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 86) return 'text-green-600';
    if (score >= 71) return 'text-blue-600';
    if (score >= 41) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 86) return 'Job-Ready';
    if (score >= 71) return 'Internship-Ready';
    if (score >= 41) return 'Skill-Building Stage';
    return 'Foundation Stage';
  };

  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'fire': return <Flame className="text-orange-500" size={24} />;
      case 'star': return <Star className="text-yellow-500" size={24} />;
      case 'calendar': return <Calendar className="text-blue-500" size={24} />;
      case 'briefcase': return <Briefcase className="text-indigo-500" size={24} />;
      case 'hammer': return <Hammer className="text-gray-500" size={24} />;
      default: return <Award className="text-purple-500" size={24} />;
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Submission Modal */}
      {submissionModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Project</h3>
            <p className="text-gray-600 text-sm mb-4">
               To verify your skill, please submit the link to your GitHub repository for this project.
            </p>
            <form onSubmit={submitProject}>
               <input 
                 type="url" 
                 placeholder="https://github.com/username/repo" 
                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
                 value={submissionModal.link}
                 onChange={(e) => setSubmissionModal({...submissionModal, link: e.target.value})}
                 required
               />
               <div className="flex gap-3 justify-end">
                 <button 
                   type="button" 
                   onClick={() => setSubmissionModal({ show: false, projectId: null, link: '' })}
                   className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
                 >
                   Verify & Complete
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <div className="flex items-center gap-4 mt-2">
             <div className="flex gap-2 overflow-x-auto">
                {roadmaps.map((rm, idx) => (
                   <button 
                     key={rm._id}
                     onClick={() => setActiveRoadmap(rm)}
                     className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeRoadmap?._id === rm._id ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                   >
                     {rm.title || `Roadmap ${idx + 1}`}
                   </button>
                ))}
             </div>
             {roadmaps.length < 3 && (
                <Link to="/generate" className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                   + New Roadmap
                </Link>
             )}
          </div>
          <p className="text-gray-600 mt-2">Target: <span className="font-semibold text-indigo-600">{activeRoadmap?.goal || activeRoadmap?.title}</span></p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-1 text-orange-500 font-bold text-xl">
               <Flame size={24} fill="currentColor" /> {user?.streak || 0}
             </div>
             <p className="text-xs text-gray-500 uppercase tracking-wide">Day Streak</p>
          </div>
          <div className="hidden md:block h-12 w-px bg-gray-200"></div>
          <div className="text-center">
             <div className={`text-2xl font-bold ${getScoreColor(user?.readinessScore || 0)}`}>
               {user?.readinessScore || 0}%
             </div>
             <p className="text-xs text-gray-500 uppercase tracking-wide">Readiness Score</p>
          </div>
          <div className="hidden md:block h-12 w-px bg-gray-200"></div>
          <div className="text-center">
             <div className="text-xl font-bold text-indigo-600">
               {getScoreLabel(user?.readinessScore || 0)}
             </div>
             <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      {user?.badges?.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="text-indigo-600" /> Your Achievements
          </h2>
          <div className="flex flex-wrap gap-4">
            {user.badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
                {getBadgeIcon(badge.icon)}
                <div>
                  <p className="font-bold text-indigo-900 text-sm">{badge.name}</p>
                  <p className="text-xs text-indigo-600">{new Date(badge.earnedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phases and Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        
        {/* Learning Phases */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-indigo-600" /> Learning Roadmap
          </h2>
          
          <div className="space-y-4">
            {activeRoadmap?.phases?.map((phase) => (
              <div key={phase._id} className={`p-5 rounded-xl border transition ${phase.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-indigo-300 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold text-lg ${phase.completed ? 'text-green-800' : 'text-gray-900'}`}>{phase.name}</h3>
                  <button onClick={() => handleProgress(phase._id, 'phase', phase.completed)}>
                    {phase.completed 
                      ? <CheckCircle className="text-green-600" /> 
                      : <Circle className="text-gray-300 hover:text-indigo-600" />
                    }
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-3 font-medium">{phase.weeks}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {phase.topics.map((topic, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{topic}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Resources</p>
                  <div className="space-y-1">
                    {phase.resources.map((res, i) => (
                      <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:underline text-sm">
                        <ExternalLink size={14} /> {res.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Hammer className="text-indigo-600" /> Practical Projects
          </h2>

          <div className="space-y-4">
            {activeRoadmap?.projects?.map((project) => (
              <div key={project._id} className={`p-5 rounded-xl border transition ${project.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-indigo-300 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold text-lg ${project.completed ? 'text-green-800' : 'text-gray-900'}`}>{project.name}</h3>
                  <button onClick={() => handleProgress(project._id, 'project', project.completed)}>
                    {project.completed 
                      ? <CheckCircle className="text-green-600" /> 
                      : <Circle className="text-gray-300 hover:text-indigo-600" />
                    }
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Skills Applied</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.skills.map((skill, i) => (
                      <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded border border-indigo-100">{skill}</span>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-800 bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200 transition">
                        <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                        View Starter Repo
                      </a>
                    )}
                    
                    {project.completed && project.submissionLink && (
                      <a href={project.submissionLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-100 px-3 py-1.5 rounded-md hover:bg-green-200 transition border border-green-200">
                        <CheckCircle size={16} /> Verified Submission
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;

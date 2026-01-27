import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const Navbar = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      // Call backend logout API
      await axios.get(`${API_URL}/api/auth/logout`, { withCredentials: true });
      // Navigate to login page
      navigate('/auth');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Home link */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Mr. Pathfinder
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 font-medium flex items-center">
          <Link to="/dashboard" className="hover:text-indigo-200 transition">
            Student Dashboard
          </Link>
          <Link to="/hr-dashboard" className="hover:text-indigo-200 transition">
            HR Portal
          </Link>
          <Link to="/auth" className="hover:text-indigo-200 transition">
            Login
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

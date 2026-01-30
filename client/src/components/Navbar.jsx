import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get user from localStorage to check role
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isHR = user?.role === 'hr';

  // Logout function
  const handleLogout = async () => {
    try {
      // Call backend logout API
      await api.get('/api/auth/logout');
      // Clear token and user info
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast.success('Logged out successfully!');
      
      // Navigate to login page
      navigate('/auth');
      setIsOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error('Logout failed');
    }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo / Home link */}
          <Link to="/" className="text-2xl font-bold tracking-tight" onClick={closeMenu}>
            Mr. Pathfinder
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 font-medium items-center">
            {!isHR && (
              <Link to="/dashboard" className="hover:text-indigo-200 transition">
                Student Dashboard
              </Link>
            )}
            {isHR && (
              <Link to="/hr-dashboard" className="hover:text-indigo-200 transition">
                HR Portal
              </Link>
            )}
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

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-4 pb-4 animate-in slide-in-from-top-2">
            {!isHR && (
              <Link to="/dashboard" className="hover:text-indigo-200 transition block py-2" onClick={closeMenu}>
                Student Dashboard
              </Link>
            )}
            {isHR && (
              <Link to="/hr-dashboard" className="hover:text-indigo-200 transition block py-2" onClick={closeMenu}>
                HR Portal
              </Link>
            )}
            {user ? (
              <>
                <Link to="/profile" className="hover:text-indigo-200 transition block py-2" onClick={closeMenu}>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800 transition w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="hover:text-indigo-200 transition block py-2" onClick={closeMenu}>
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

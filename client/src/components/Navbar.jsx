import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu, X } from 'lucide-react';
import { API_URL } from '../config';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      // Call backend logout API
      await axios.get(`${API_URL}/api/auth/logout`, { withCredentials: true });
      // Navigate to login page
      navigate('/auth');
      setIsOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
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

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-4 pb-4 animate-in slide-in-from-top-2">
            <Link to="/dashboard" className="hover:text-indigo-200 transition block py-2" onClick={closeMenu}>
              Student Dashboard
            </Link>
            <Link to="/hr-dashboard" className="hover:text-indigo-200 transition block py-2" onClick={closeMenu}>
              HR Portal
            </Link>
            <Link to="/auth" className="hover:text-indigo-200 transition block py-2" onClick={closeMenu}>
              Login
            </Link>
            <button
              onClick={handleLogout}
              className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800 transition w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

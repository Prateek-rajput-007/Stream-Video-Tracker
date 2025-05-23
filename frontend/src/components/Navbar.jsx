
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/analytics', label: 'Analytics' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">
          LearnTrack
        </Link>

        {/* Toggle button (Mobile) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
        >
          <svg className="w-7 h-7 transition-all duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                menuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-white hover:text-gray-200 transition-colors ${
                isActive(to) ? 'underline underline-offset-4' : ''
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-3 w-full space-y-2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 transition-colors ${
                  isActive(to) ? 'ring-2 ring-white' : ''
                }`}
              >
                {label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="block w-full text-left px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

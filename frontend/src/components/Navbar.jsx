// import { useNavigate, Link } from 'react-router-dom';
// import { useState } from 'react';

// function Navbar() {
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-lg">
//       <div className="max-w-6xl mx-auto flex justify-between items-center">
//         <Link to="/" className="text-white text-2xl font-bold">
//           LearnTrack
//         </Link>
//         {/* Mobile menu button */}
//         <button
//           className="md:hidden text-white focus:outline-none"
//           onClick={() => setMenuOpen((open) => !open)}
//           aria-label="Toggle Menu"
//         >
//           <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
//           </svg>
//         </button>
//         {/* Desktop links */}
//         <div className="space-x-4 hidden md:flex">
//           <Link to="/" className="text-white hover:text-gray-200 transition-colors">
//             Home
//           </Link>
//           <Link to="/dashboard" className="text-white hover:text-gray-200 transition-colors">
//             Dashboard
//           </Link>
//           <Link to="/analytics" className="text-white hover:text-gray-200 transition-colors">
//             Analytics
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="text-white hover:text-gray-200 transition-colors"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//       {/* Mobile dropdown */}
//       {menuOpen && (
//         <div className="md:hidden mt-2 px-2 pb-2 space-y-2">
//           <Link
//             to="/"
//             className="block text-white bg-blue-700 rounded px-3 py-2 hover:bg-blue-800"
//             onClick={() => setMenuOpen(false)}
//           >
//             Home
//           </Link>
//           <Link
//             to="/dashboard"
//             className="block text-white bg-blue-700 rounded px-3 py-2 hover:bg-blue-800"
//             onClick={() => setMenuOpen(false)}
//           >
//             Dashboard
//           </Link>
//           <Link
//             to="/analytics"
//             className="block text-white bg-blue-700 rounded px-3 py-2 hover:bg-blue-800"
//             onClick={() => setMenuOpen(false)}
//           >
//             Analytics
//           </Link>
//           <button
//             onClick={() => {
//               setMenuOpen(false);
//               handleLogout();
//             }}
//             className="block w-full text-left text-white bg-blue-700 rounded px-3 py-2 hover:bg-blue-800"
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;
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
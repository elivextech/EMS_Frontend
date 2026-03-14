import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/emails': 'Emails',
  '/emails/compose': 'Compose Email',
  '/templates': 'Templates',
  '/contacts': 'Contact Submissions',
  '/upload-template': 'Upload Template',
  '/register-user': 'Register User',
  '/manage-users': 'Manage Users',
  '/change-password': 'Change Password',
};

const Navbar = ({ onMenuClick }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const title = routeTitles[pathname] || 'EMS';

  const handleLogout = async () => {
    await logout();
    navigate('/user/login');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-gray-950 border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 flex-shrink-0">
      {/* Left: hamburger + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex-shrink-0"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="text-white font-semibold text-sm sm:text-base truncate">{title}</h1>
          <p className="text-gray-500 text-[11px] hidden sm:block">Elivex Management System</p>
        </div>
      </div>

      {/* Right: status + user info dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 relative" ref={dropdownRef}>
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-500 mr-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Connected
        </div>

        {/* User Dropdown Trigger */}
        {user && (
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1 -mr-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white text-xs font-bold">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden sm:block text-left leading-tight mr-1">
              <p className="text-gray-200 text-xs font-medium truncate max-w-[100px]">{user.name || user.email}</p>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider">{user.role}</p>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-[110%] w-56 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 z-50 overflow-hidden transform origin-top-right transition-all animate-fade-in">
            {/* Mobile-only header details inside dropdown */}
            <div className="sm:hidden px-4 py-3 border-b border-gray-800 mb-1">
              <p className="text-white text-sm font-medium truncate">{user?.name || user?.email}</p>
              <p className="text-gray-400 text-xs mt-0.5 truncate">{user?.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-gray-800 text-gray-300">
                {user?.role}
              </span>
            </div>

            <Link
              to="/change-password"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Change Password
            </Link>
            
            <div className="h-px bg-gray-800 my-1 1wx px-4" />
            
            <button
              onClick={() => { setDropdownOpen(false); handleLogout(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;


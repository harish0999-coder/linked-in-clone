import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Linkedin, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Linkedin size={32} />
          <span>LinkedIn Clone</span>
        </Link>

        <div className="navbar-menu">
          <div className="navbar-user" onClick={handleProfileClick} style={{ cursor: 'pointer' }} title="View Profile">
            <div className="navbar-avatar">
              {user && getInitials(user.name)}
            </div>
            <span className="navbar-username">{user?.name}</span>
          </div>
          
          <button 
            onClick={logout} 
            className="btn btn-secondary btn-icon"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
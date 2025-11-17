import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { SIDEBAR_LINKS } from '../../../constants/pages/pages';

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const links = SIDEBAR_LINKS[userRole] || [];

  const handleLinkClick = (link) => {
    navigate(link.path);
  };

  const isActive = (link) => {
    return location.pathname === link.path;
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            className={`sidebar__nav-link ${
              isActive(link) ? 'sidebar__nav-link--active' : ''
            }`}
            onClick={() => handleLinkClick(link)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;


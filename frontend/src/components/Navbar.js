import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2E7D32' }}>
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          <i className="fas fa-utensils me-2"></i>
          AI Food Finder
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/restaurants"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#1B5E20' : 'transparent',
                  color: 'white',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#1B5E20'
                  }
                })}
              >
                <i className="fas fa-store me-1"></i>
                Restaurants
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/add"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#1B5E20' : 'transparent',
                  color: 'white',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#1B5E20'
                  }
                })}
              >
                <i className="fas fa-plus-circle me-1"></i>
                Add Restaurant
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

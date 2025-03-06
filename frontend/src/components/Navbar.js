import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <NavLink className="navbar-brand" to="/">AI Food Finder</NavLink>
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
                  backgroundColor: isActive ? "#0d6efd" : "transparent",
                  color: isActive ? "white" : "white",
                  borderRadius: "5px",
                  padding: "8px 12px",
                  textDecoration: "none",
                })}
              >
                Restaurants
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/add"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#198754" : "transparent",
                  color: isActive ? "white" : "white",
                  borderRadius: "5px",
                  padding: "8px 12px",
                  textDecoration: "none",
                })}
              >
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

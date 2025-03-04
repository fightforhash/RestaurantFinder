import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./HomePage";
import MenuPage from "./MenuPage";
import AddRestaurant from "./AddRestaurant";
import DeleteRestaurant from "./DeleteRestaurant";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h2>Restaurant Finder</h2>
          <ul className="menu">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/add-restaurant">Add Restaurant</Link>
            </li>
            <li>
              <Link to="/delete-restaurant">Delete Restaurant</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu/:category" element={<MenuPage />} />
          <Route path="/add-restaurant" element={<AddRestaurant />} />
          <Route path="/delete-restaurant" element={<DeleteRestaurant />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


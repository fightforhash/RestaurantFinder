import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RestaurantList from "./pages/RestaurantList";
import RestaurantDetails from "./pages/RestaurantDetails";
import AddRestaurant from "./pages/AddRestaurant";
import ChatPage from './pages/chatPage';
import EditRestaurant from "./pages/EditRestaurant";
import ChatButton from './components/chatButton';

const App = () => {
  return (
    <Router>
      <ChatButton />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="restaurants" element={<RestaurantList />} />
          <Route path="restaurants/:id" element={<RestaurantDetails />} />
          <Route path="add" element={<AddRestaurant />} />
          <Route path="edit/:id" element={<EditRestaurant />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

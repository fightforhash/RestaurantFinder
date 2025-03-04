import React from "react";

const AddRestaurant = () => {
  return (
    <div>
      <h3>Add a Restaurant</h3>
      <form>
        <input type="text" placeholder="Restaurant Name" />
        <input type="text" placeholder="Address" />
        <input type="text" placeholder="Hours" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddRestaurant;

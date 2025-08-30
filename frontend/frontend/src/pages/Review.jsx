import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Restaurant() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Ambil data restoran
    getRestaurantById(id)
      .then((data) => setRestaurant(data))
      .catch((err) => console.error("Error fetching restaurant:", err));

    // Ambil menu restoran
    getFoodByRestaurant(id)
      .then((data) => setMenu(data))
      .catch((err) => console.error("Error fetching menu:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !restaurant) return <p>Loading...</p>;

  return (
    <div className="restaurant-container">
      <h1>{restaurant.name}</h1>
      <p>{restaurant.address}</p>

      <h2>Menu</h2>
      {menu.length === 0 ? (
        <p>Belum ada menu.</p>
      ) : (
        <ul>
          {menu.map((food) => (
            <li key={food.id}>
              {food.name} - Rp {food.price.toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function Restaurant() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gunakan Promise.all untuk fetch data secara parallel
        const [restaurantData, menuData] = await Promise.all([
          getRestaurantById(id),
          getFoodByRestaurant(id)
        ]);
        
        setRestaurant(restaurantData);
        setMenu(menuData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data restoran. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="loading">Memuat data restoran...</div>;
  
  if (error) return <div className="error">{error}</div>;
  
  if (!restaurant) return <div className="error">Restoran tidak ditemukan.</div>;

  return (
    <div className="restaurant-container">
      <div className="restaurant-header">
        <h1>{restaurant.name}</h1>
        <p className="address">{restaurant.address}</p>
        {restaurant.description && <p className="description">{restaurant.description}</p>}
      </div>

      <div className="menu-section">
        <h2>Menu</h2>
        {menu.length === 0 ? (
          <p className="no-menu">Belum ada menu yang tersedia.</p>
        ) : (
          <div className="menu-grid">
            {menu.map((food) => (
              <div key={food.id} className="menu-item">
                <h3>{food.name}</h3>
                <p className="price">Rp {food.price.toLocaleString('id-ID')}</p>
                {food.description && <p className="food-description">{food.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
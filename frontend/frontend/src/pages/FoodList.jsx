import { useEffect, useState } from "react";
import axios from "axios";

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/foods");
        setFoods(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal fetch foods: ", err);
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Daftar Makanan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">{food.name}</h2>
            <p className="text-gray-700 mb-1">{food.description}</p>
            <p className="text-gray-900 font-bold mb-1">Harga: Rp {food.price}</p>
            {food.category && (
              <p className="text-sm text-gray-500">Kategori: {food.category.name}</p>
            )}
            {food.restaurant && (
              <p className="text-sm text-gray-500">Restaurant: {food.restaurant.name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

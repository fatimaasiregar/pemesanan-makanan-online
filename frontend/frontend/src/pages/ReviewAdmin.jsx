import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewAdmin() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/reviews/restaurant/all`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Gagal fetch reviews:", err);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Semua Review</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-500">Tidak ada review.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {["User ID", "Restaurant ID", "Rating", "Comment", "Tanggal"].map((th) => (
                  <th
                    key={th}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{r.userId}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{r.restaurantId}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{r.rating}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{r.comment}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {new Date(r.reviewDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

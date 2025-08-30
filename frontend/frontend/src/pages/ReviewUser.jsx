import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewUser() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null); // ID review yang sedang diedit
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const userId = localStorage.getItem("userId");
  const restaurantId = 1; // contoh

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/reviews/user?userId=${userId}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Gagal fetch reviews:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/reviews", {
        userId: Number(userId),
        restaurantId: Number(restaurantId),
        rating: Number(rating),
        comment
      });
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error("Gagal menambahkan review:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error("Gagal hapus review:", err);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/reviews/${id}`, {
        rating: Number(editRating),
        comment: editComment
      });
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      console.error("Gagal update review:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Review Saya</h1>

      {/* Form tambah review */}
      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded-md">
        <div className="mb-2">
          <label className="block mb-1 font-medium">Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border p-1 rounded w-20"
          >
            {[1,2,3,4,5].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-medium">Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2 rounded w-full"
            rows={3}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tambah Review
        </button>
      </form>

      {/* Tabel review */}
      {reviews.length === 0 ? (
        <p>Tidak ada review.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Restaurant ID</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Comment</th>
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.restaurantId}</td>
                <td className="border p-2">
                  {editingId === r.id ? (
                    <select value={editRating} onChange={(e) => setEditRating(e.target.value)} className="border p-1 rounded w-20">
                      {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  ) : (
                    r.rating
                  )}
                </td>
                <td className="border p-2">
                  {editingId === r.id ? (
                    <input
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    r.comment
                  )}
                </td>
                <td className="border p-2">{new Date(r.reviewDate).toLocaleString()}</td>
                <td className="border p-2 flex gap-2">
                  {editingId === r.id ? (
                    <>
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        onClick={() => handleUpdate(r.id)}
                      >
                        Simpan
                      </button>
                      <button
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                        onClick={() => setEditingId(null)}
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        onClick={() => handleEdit(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(r.id)}
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

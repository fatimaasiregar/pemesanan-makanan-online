import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Admin() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", categoryId: "", restaurantId: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role")?.toUpperCase();
    if (role !== "ADMIN") window.location.href = "/admin/login";

    fetchCategories();
    fetchRestaurants();
    fetchFoods();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Gagal fetch kategori:", err);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.error("Gagal fetch restaurant:", err);
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/foods");
      if (Array.isArray(res.data)) {
        setFoods(res.data);
      } else if (res.data.content) {
        setFoods(res.data.content);
      } else {
        setFoods([]);
      }
    } catch (err) {
      console.error("Gagal fetch foods:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId || !form.restaurantId) {
      alert("Pilih kategori dan restoran dulu!");
      return;
    }
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/foods/${editingId}`, form);
      } else {
        await axios.post("http://localhost:8080/api/foods", form);
      }
      setForm({ name: "", price: "", categoryId: "", restaurantId: "" });
      setEditingId(null);
      setShowForm(false);
      fetchFoods();
    } catch (err) {
      console.error("Gagal simpan:", err);
    }
  };

  const handleEdit = (food) => {
    setForm({
      name: food.name,
      price: food.price,
      categoryId: food.category?.id || "",
      restaurantId: food.restaurant?.id || "",
    });
    setEditingId(food.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin hapus data ini?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/foods/${id}`);
      fetchFoods();
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Makanan (Admin)</h1>

      {/* Tombol tambah produk */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 transition text-white px-5 py-2 rounded shadow mb-6"
        >
          Tambah Produk
        </button>
      )}

      {/* Form tambah/edit dengan animasi */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {editingId ? "Edit Produk" : "Tambah Produk"}
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nama makanan"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                required
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Harga"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                required
              />
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                required
              >
                <option value="">Pilih Kategori</option>
                {Array.isArray(categories) &&
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              <select
                name="restaurantId"
                value={form.restaurantId}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                required
              >
                <option value="">Pilih Restaurant</option>
                {Array.isArray(restaurants) &&
                  restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
              </select>
              <div className="flex space-x-3 mt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded shadow"
                >
                  {editingId ? "Update" : "Tambah"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: "", price: "", categoryId: "", restaurantId: "" });
                    setEditingId(null);
                    setShowForm(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 transition text-white px-5 py-2 rounded shadow"
                >
                  Batal
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table list makanan */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["ID", "Nama", "Harga", "Kategori", "Restaurant", "Aksi"].map((th) => (
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
            {Array.isArray(foods) && foods.length > 0 ? (
              foods.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{f.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.price}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.category?.name || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.restaurant?.name || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 flex space-x-2">
                    <button
                      onClick={() => handleEdit(f)}
                      className="bg-yellow-400 hover:bg-yellow-500 transition text-white px-3 py-1 rounded shadow"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded shadow"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

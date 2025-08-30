// src/pages/KelolaPesanan.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function KelolaPesanan() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role")?.toUpperCase();
    if (role !== "ADMIN") {
      window.location.href = "/admin/login";
    } else {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await axios.get("http://localhost:8080/api/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Gagal fetch orders:", err);
      setErrorMessage("Gagal memuat pesanan.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchOrderItems = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/orders/${orderId}/items`);
      setOrderItems(res.data || []);
    } catch (err) {
      console.error("Gagal fetch order items:", err);
      setErrorMessage("Gagal memuat items pesanan.");
    }
  };

  const handleViewItems = (order) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setUpdatingStatusId(orderId);
      await axios.patch(
        `http://localhost:8080/api/orders/${orderId}/status`,
        null,
        { params: { status } }
      );
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      console.error("Gagal update status:", err);
      setErrorMessage("Gagal memperbarui status pesanan.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Kelola Pesanan (Admin)</h1>

      {errorMessage && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow">
          {errorMessage}
        </div>
      )}

      {!selectedOrder ? (
        // Tabel Orders
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {["ID Order", "User ID", "Alamat", "Status", "Aksi"].map((th) => (
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
              {loadingOrders ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    Memuat pesanan...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    Tidak ada pesanan
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{o.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {o.userId || (o.user?.id ?? "-")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{o.address || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{o.status}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 flex space-x-2">
                      <button
                        onClick={() => handleViewItems(o)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
                      >
                        Lihat Items
                      </button>
                      {o.status !== "CONFIRMED" && (
                        <button
                          onClick={() => handleStatusUpdate(o.id, "CONFIRMED")}
                          disabled={updatingStatusId === o.id}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow disabled:opacity-50"
                        >
                          Konfirmasi
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // Detail Items Pesanan
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Detail Pesanan ID: {selectedOrder.id}
          </h2>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["Nama Makanan", "Qty", "Harga"].map((th) => (
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
                {orderItems.length > 0 ? (
                  orderItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.foodName || item.food?.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Rp {item.price?.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center p-4 text-gray-500">
                      Tidak ada item
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleBackToOrders}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded shadow"
          >
            Kembali
          </button>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaArrowLeft, FaShoppingCart, FaExclamationTriangle, FaCheckCircle, 
  FaHistory, FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React from "react";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export default function Riwayat() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [availableStatuses, setAvailableStatuses] = useState(["all"]);

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      const ordersFromBackend = res.data.map(order => ({
        id: order.id,
        userId: order.userId,
        status: order.status?.toLowerCase() || "pending",
        receiverName: order.receiverName || "-",
        phone: order.phone || "-",
        address: order.address || "-",
        city: order.city || "-",
        note: order.note || "-",
        createdAt: order.orderDate || new Date().toISOString(),
        orderItems: order.items.map(item => ({
          id: item.id,
          foodId: item.foodId,
          foodName: item.foodName,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }))
      }));

      setOrders(ordersFromBackend);

      // Ambil daftar status unik dari backend
      const statuses = Array.from(new Set(ordersFromBackend.map(o => o.status)));
      setAvailableStatuses(["all", ...statuses]);

    } catch (err) {
      console.error("Gagal fetch orders:", err.message);
      setOrders([]);
      setErrorMessage("Gagal memuat riwayat pesanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { text: 'Selesai', color: 'text-green-600', bg: 'bg-green-100' };
      case 'pending':
        return { text: 'Menunggu', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'cancelled':
        return { text: 'Dibatalkan', color: 'text-red-600', bg: 'bg-red-100' };
      default:
        return { text: status || 'Tidak diketahui', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getOrderTotal = (order) => {
    return order.orderItems?.reduce((sum, item) => sum + (item.subtotal ?? 0), 0) ?? 0;
  };

  // Fungsi delete order
  const deleteOrder = async (orderId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) return;

    try {
      await api.delete(`/orders/${orderId}`);
      setSuccessMessage("Pesanan berhasil dihapus");
      // refresh daftar pesanan
      fetchOrders();
    } catch (err) {
      console.error("Gagal menghapus pesanan:", err.message);
      setErrorMessage("Gagal menghapus pesanan");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Notification Messages */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center justify-between w-96 shadow-lg z-50">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage("")} className="text-red-700 font-bold">×</button>
        </div>
      )}
      
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center justify-between w-96 shadow-lg z-50">
          <div className="flex items-center">
            <FaCheckCircle className="mr-2" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage("")} className="text-green-700 font-bold">×</button>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Filter Pesanan</h2>
          <div className="flex flex-wrap gap-2">
            {availableStatuses.map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filterStatus === status ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === "all" ? "Semua" :
                  status === "completed" ? "Selesai" :
                  status === "pending" ? "Menunggu" :
                  status === "cancelled" ? "Dibatalkan" : status
                }
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Daftar Pesanan Anda</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border p-6 rounded-lg bg-white shadow-sm animate-pulse">
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaHistory className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada pesanan dengan status ini</h3>
              <p className="text-gray-500 mb-6">Tidak ditemukan pesanan dengan status yang dipilih.</p>
              <button 
                onClick={() => setFilterStatus("all")}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Lihat Semua Pesanan
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map(order => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <div key={order.id} className="border p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold text-lg text-gray-800">Pesanan #{order.id}</p>
                        <p className="text-sm text-gray-600 mt-1">Penerima: {order.receiverName}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Items Pesanan:</h4>
                      <ul className="space-y-2">
                        {order.orderItems?.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <span>{item.foodName} x {item.quantity}</span>
                            <span>Rp {(item.subtotal ?? 0).toLocaleString("id-ID")}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                        <span>Total Pembayaran:</span>
                        <span className="text-orange-500">
                          Rp {getOrderTotal(order).toLocaleString("id-ID")}
                        </span>
                      </div>

                      {/* Tombol Hapus */}
                      <div className="mt-4 text-right">
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          <FaTrash /> Hapus Pesanan
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// src/pages/Laporan.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Laporan() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  // Filter states
  const [customerFilter, setCustomerFilter] = useState("");
  const [orderDate, setOrderDate] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/orders");
        setOrders(res.data);
        setFilteredOrders(res.data);
        calculateGrandTotal(res.data);
      } catch (err) {
        console.error("Gagal fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const calculateGrandTotal = (ordersList) => {
    const total = ordersList.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    setGrandTotal(total);
  };

  const handleFilter = () => {
    let temp = [...orders];

    if (customerFilter.trim()) {
      temp = temp.filter(order =>
        (order.receiverName || "").toLowerCase().includes(customerFilter.toLowerCase())
      );
    }

    if (orderDate) {
      const targetDate = new Date(orderDate);
      targetDate.setHours(0, 0, 0, 0);
      temp = temp.filter(order => {
        const orderCreated = new Date(order.orderDate);
        orderCreated.setHours(0, 0, 0, 0);
        return orderCreated.getTime() === targetDate.getTime();
      });
    }

    setFilteredOrders(temp);
    calculateGrandTotal(temp);
  };

  const handleReset = () => {
    setCustomerFilter("");
    setOrderDate("");
    setFilteredOrders(orders);
    calculateGrandTotal(orders);
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Laporan Pesanan</h1>

      {/* Filter */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Nama Customer</label>
          <input
            type="text"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            placeholder="Masukkan nama customer"
            className="border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Tanggal Pemesanan</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            Filter
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["ID Order", "Nama Customer", "Nama Makanan", "Harga Satuan", "Jumlah", "Subtotal", "Total Order", "Tanggal"].map(
                (th) => (
                  <th
                    key={th}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                  >
                    {th}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) =>
                order.items?.map((item, idx) => (
                  <tr key={`${order.id}-${idx}`} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{order.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{order.receiverName || "-"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.foodName || "-"}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.price?.toLocaleString() || 0}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.subtotal?.toLocaleString() || 0}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{order.totalAmount?.toLocaleString() || 0}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{new Date(order.orderDate).toLocaleString()}</td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
          {filteredOrders.length > 0 && (
            <tfoot>
              <tr className="bg-gray-300 font-bold">
                <td colSpan={6} className="px-4 py-2 text-right border">
                  Grand Total
                </td>
                <td className="px-4 py-2 border">{grandTotal.toLocaleString()}</td>
                <td className="px-4 py-2 border"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

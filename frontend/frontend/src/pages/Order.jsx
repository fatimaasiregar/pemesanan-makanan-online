import React, { useEffect, useState } from "react";

export default function Order({ userId }) {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({}); // { orderId: [orderItems] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch orders
        const ordersData = await getOrdersByUser(userId);
        setOrders(ordersData);

        // Fetch order items for each order
        const itemsPromises = ordersData.map(async (order) => {
          try {
            const items = await getOrderItemsByOrder(order.id);
            return { orderId: order.id, items };
          } catch (err) {
            console.error(`Error fetching items for order ${order.id}:`, err);
            return { orderId: order.id, items: [], error: true };
          }
        });

        // Wait for all order items to be fetched
        const allItems = await Promise.allSettled(itemsPromises);
        
        // Convert to object format
        const itemsObject = {};
        allItems.forEach(result => {
          if (result.status === 'fulfilled') {
            itemsObject[result.value.orderId] = result.value.items;
          }
        });
        
        setOrderItems(itemsObject);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Gagal memuat data pesanan. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Format tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Hitung total harga order
  const calculateOrderTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => {
      return total + (item.food?.price || 0) * item.quantity;
    }, 0);
  };

  // Status order dengan styling
  const getStatusStyle = (status) => {
    const statusStyles = {
      'pending': { color: '#f39c12', bg: '#fff3cd' },
      'processing': { color: '#17a2b8', bg: '#d1ecf1' },
      'completed': { color: '#28a745', bg: '#d4edda' },
      'cancelled': { color: '#dc3545', bg: '#f8d7da' }
    };
    
    return statusStyles[status.toLowerCase()] || { color: '#6c757d', bg: '#f8f9fa' };
  };

  if (!userId) {
    return <div className="error">User ID tidak tersedia.</div>;
  }

  if (loading) {
    return <div className="loading">Memuat data pesanan...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="no-orders">
        <h1>Pesanan Saya</h1>
        <p>Belum ada pesanan.</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>Pesanan Saya</h1>
      
      {orders.map((order) => {
        const items = orderItems[order.id] || [];
        const statusStyle = getStatusStyle(order.status);
        
        return (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h2>Pesanan #{order.id}</h2>
                <span className="order-date">{formatDate(order.created_at)}</span>
              </div>
              <div 
                className="order-status"
                style={{ 
                  color: statusStyle.color, 
                  backgroundColor: statusStyle.bg,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {order.status.toUpperCase()}
              </div>
            </div>

            <div className="order-items">
              <h3>Items:</h3>
              <ul>
                {items.length === 0 ? (
                  <li className="no-items">Tidak ada items atau sedang loading...</li>
                ) : (
                  items.map((item) => (
                    <li key={item.id} className="order-item">
                      <span className="item-name">{item.food?.name || 'Unknown Item'}</span>
                      <span className="item-quantity">x {item.quantity}</span>
                      <span className="item-price">
                        Rp {item.food ? (item.food.price * item.quantity).toLocaleString('id-ID') : '0'}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="order-footer">
              <div className="order-total">
                Total: Rp {calculateOrderTotal(items).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
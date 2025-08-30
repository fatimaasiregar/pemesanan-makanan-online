package com.example.demo.service;

import com.example.demo.model.Food;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.repository.FoodRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Transactional
    public Order createOrder(Map<String, Object> orderData) {
        try {
            // Ambil data order
            Long userId = ((Number) orderData.get("userId")).longValue();
            String receiverName = (String) orderData.getOrDefault("receiverName", "Tidak diisi");
            String phone = (String) orderData.getOrDefault("phone", "Tidak diisi");
            String address = (String) orderData.getOrDefault("address", "Tidak diisi");
            String city = (String) orderData.getOrDefault("city", "Tidak diisi");
            String note = (String) orderData.getOrDefault("note", "Tidak ada catatan");

            // Buat order
            Order order = new Order();
            order.setUserId(userId);
            order.setReceiverName(receiverName);
            order.setPhone(phone);
            order.setAddress(address);
            order.setCity(city);
            order.setNote(note); // ✅ perbaikan

            // Simpan order dulu
            Order savedOrder = orderRepository.save(order);

            // Process items
            List<Map<String, Object>> items = (List<Map<String, Object>>) orderData.get("items");
            if (items == null || items.isEmpty()) {
                throw new RuntimeException("Items pesanan kosong");
            }

            for (Map<String, Object> itemData : items) {
                Long foodId = ((Number) itemData.get("foodId")).longValue();
                Integer quantity = ((Number) itemData.get("quantity")).intValue();
                if (quantity <= 0) {
                    throw new RuntimeException("Quantity harus > 0");
                }

                Food food = foodRepository.findById(foodId)
                        .orElseThrow(() -> new RuntimeException("Food tidak ditemukan dengan ID: " + foodId));

                OrderItem orderItem = new OrderItem();
                orderItem.setFood(food);
                orderItem.setQuantity(quantity);
                orderItem.setPrice(food.getPrice()); // harga saat checkout
                orderItem.setOrder(savedOrder);

                orderItemRepository.save(orderItem);
                savedOrder.addOrderItem(orderItem); // tambahkan ke order
            }

            // Simpan kembali order dengan items
            return orderRepository.save(savedOrder);

        } catch (Exception e) {
            e.printStackTrace(); // supaya error lengkap muncul di console
            throw new RuntimeException("Error creating order: " + e.getMessage(), e);
        }
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        orderRepository.delete(order);
    }

    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    public List<Object[]> getSalesReport() {
        return orderItemRepository.findSalesReport();
    }
}

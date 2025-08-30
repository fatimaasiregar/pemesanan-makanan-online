package com.example.demo.controller;

import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.model.Food;
import com.example.demo.repository.FoodRepository;
import com.example.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173") // pastikan sesuai frontend
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private FoodRepository foodRepository;

    // ================= CREATE ORDER =================
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData) {
        try {
            if (orderData.get("userId") == null ||
                orderData.get("address") == null ||
                orderData.get("items") == null) {

                return ResponseEntity.badRequest().body(
                        Map.of("error", "Missing required fields: userId, address, items")
                );
            }

            Order order = orderService.createOrder(orderData);
            return ResponseEntity.ok(new OrderResponse(order, foodRepository));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Failed to create order: " + e.getMessage())
            );
        }
    }

    // ================= GET ALL ORDERS =================
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        List<OrderResponse> response = orders.stream()
                .map(o -> new OrderResponse(o, foodRepository))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ================= GET ORDER BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        if (order != null) {
            return ResponseEntity.ok(new OrderResponse(order, foodRepository));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ================= GET ORDER ITEMS =================
    @GetMapping("/{id}/items")
    public ResponseEntity<List<OrderItemResponse>> getOrderItems(@PathVariable Long id) {
        List<OrderItem> items = orderService.getOrderItemsByOrderId(id);
        List<OrderItemResponse> response = items.stream()
                .map(item -> new OrderItemResponse(item, foodRepository))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ================= UPDATE STATUS =================
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Order updated = orderService.updateOrderStatus(id, status.toUpperCase());
            return ResponseEntity.ok(new OrderResponse(updated, foodRepository));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ================= DELETE ORDER =================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(Map.of("message", "Order deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ================= DTO =================
    public static class OrderResponse {
        private Long id;
        private Long userId;
        private String receiverName;
        private String phone;
        private String address;
        private String city;
        private String note;
        private String status;
        private String orderDate;
        private List<OrderItemResponse> items;
        private double totalAmount;

        public OrderResponse(Order order, FoodRepository foodRepo) {
            this.id = order.getId();
            this.userId = order.getUserId();
            this.receiverName = order.getReceiverName();
            this.phone = order.getPhone();
            this.address = order.getAddress();
            this.city = order.getCity();
            this.note = order.getNote();
            this.status = order.getStatus();
            this.orderDate = order.getCreatedAt() != null ? order.getCreatedAt().toString() : "-";

            this.items = order.getOrderItems().stream()
                    .map(item -> new OrderItemResponse(item, foodRepo))
                    .collect(Collectors.toList());

            this.totalAmount = items.stream()
                    .mapToDouble(OrderItemResponse::getSubtotal)
                    .sum();
        }

        // Getter
        public Long getId() { return id; }
        public Long getUserId() { return userId; }
        public String getReceiverName() { return receiverName; }
        public String getPhone() { return phone; }
        public String getAddress() { return address; }
        public String getCity() { return city; }
        public String getNote() { return note; }
        public String getStatus() { return status; }
        public String getOrderDate() { return orderDate; }
        public List<OrderItemResponse> getItems() { return items; }
        public double getTotalAmount() { return totalAmount; }
    }

    public static class OrderItemResponse {
        private Long id;
        private Long foodId;
        private String foodName;
        private double price;
        private int quantity;
        private double subtotal;

        public OrderItemResponse(OrderItem item, FoodRepository foodRepo) {
            this.id = item.getId();
            this.foodId = item.getFoodId();
            this.quantity = item.getQuantity();

            Food food = foodRepo.findById(item.getFoodId())
                    .orElseThrow(() -> new RuntimeException("Food not found"));

            this.foodName = food.getName();
            this.price = food.getPrice();
            this.subtotal = food.getPrice() * this.quantity;
        }

        // Getter
        public Long getId() { return id; }
        public Long getFoodId() { return foodId; }
        public String getFoodName() { return foodName; }
        public double getPrice() { return price; }
        public int getQuantity() { return quantity; }
        public double getSubtotal() { return subtotal; }
    }
}

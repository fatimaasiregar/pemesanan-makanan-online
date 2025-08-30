package com.example.demo.controller;

import com.example.demo.model.OrderItem;
import com.example.demo.model.Food;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.FoodRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderItemController {

    private final OrderItemRepository orderItemRepository;
    private final FoodRepository foodRepository;

    public OrderItemController(OrderItemRepository orderItemRepository,
                               FoodRepository foodRepository) {
        this.orderItemRepository = orderItemRepository;
        this.foodRepository = foodRepository;
    }

    // Get all order items with subtotal
    @GetMapping
    public List<OrderItemResponse> getAll() {
        return orderItemRepository.findAll()
                .stream()
                .map(OrderItemResponse::new)
                .collect(Collectors.toList());
    }

    // Get order item by id
    @GetMapping("/{id}")
    public OrderItemResponse getById(@PathVariable Long id) {
        OrderItem item = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found id=" + id));
        return new OrderItemResponse(item);
    }

    // Create new order item
    @PostMapping
    public OrderItemResponse createOrderItem(@RequestBody CreateOrderItemRequest request) {
        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() -> new RuntimeException("Food not found"));

        OrderItem item = new OrderItem();
        item.setFoodId(food.getId());
        item.setQuantity(request.getQuantity());
        item.setPrice(food.getPrice()); // Simpan harga Food ke OrderItem

        orderItemRepository.save(item);
        return new OrderItemResponse(item);
    }

    // Update quantity
    @PutMapping("/{id}")
    public OrderItemResponse updateQuantity(@PathVariable Long id, @RequestBody UpdateQuantityRequest request) {
        OrderItem item = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found id=" + id));
        item.setQuantity(request.getQuantity());
        item.setPrice(item.getPrice()); // pastikan price tetap ada
        orderItemRepository.save(item);
        return new OrderItemResponse(item);
    }

    // Delete order item
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        orderItemRepository.deleteById(id);
    }

    // DTO request untuk update quantity
    public static class UpdateQuantityRequest {
        private int quantity;

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    // DTO request untuk create order item
    public static class CreateOrderItemRequest {
        private Long foodId;
        private int quantity;

        public Long getFoodId() { return foodId; }
        public void setFoodId(Long foodId) { this.foodId = foodId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    // DTO response untuk include subtotal
    public static class OrderItemResponse {
        private Long id;
        private Long foodId;
        private int quantity;
        private double price;
        private double subtotal;

        public OrderItemResponse(OrderItem item) {
            this.id = item.getId();
            this.foodId = item.getFoodId();
            this.quantity = item.getQuantity();
            this.price = item.getPrice();
            this.subtotal = this.price * this.quantity;
        }

        public Long getId() { return id; }
        public Long getFoodId() { return foodId; }
        public int getQuantity() { return quantity; }
        public double getPrice() { return price; }
        public double getSubtotal() { return subtotal; }
    }
}

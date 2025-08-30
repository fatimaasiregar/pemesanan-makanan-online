package com.example.demo.service;

import com.example.demo.model.OrderItem;
import com.example.demo.model.Food;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.FoodRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final FoodRepository foodRepository;

    public OrderItemService(OrderItemRepository orderItemRepository, FoodRepository foodRepository) {
        this.orderItemRepository = orderItemRepository;
        this.foodRepository = foodRepository;
    }

    // Ambil semua order item
    public List<OrderItem> getAll() {
        return orderItemRepository.findAll();
    }

    // Ambil berdasarkan ID
    public Optional<OrderItem> getById(Long id) {
        return orderItemRepository.findById(id);
    }

    // Buat order item baru
    public OrderItem createOrderItem(Long foodId, int quantity) {
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found"));

        OrderItem item = new OrderItem();
        item.setFoodId(food.getId());
        item.setQuantity(quantity);
        item.setPrice(food.getPrice()); // simpan price dari Food

        return orderItemRepository.save(item);
    }

    // Update quantity
    public OrderItem updateQuantity(Long id, int quantity) {
        OrderItem item = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found"));
        item.setQuantity(quantity);
        item.setPrice(item.getPrice()); // pastikan price tetap ada
        return orderItemRepository.save(item);
    }

    // Delete order item
    public void delete(Long id) {
        orderItemRepository.deleteById(id);
    }

    // Hitung subtotal order item
    public double calculateSubtotal(OrderItem item) {
        return item.getPrice() * item.getQuantity();
    }
}

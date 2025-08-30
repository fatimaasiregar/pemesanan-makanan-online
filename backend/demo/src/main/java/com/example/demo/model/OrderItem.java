package com.example.demo.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "food_id", nullable = false)
    private Long foodId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

@Column(nullable = false)
private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    @Transient
    private Food food; // supaya bisa di-set langsung

    public OrderItem() {}

    public OrderItem(Food food, Integer quantity, Order order) {
        this.food = food;
        this.foodId = food.getId();
        this.quantity = quantity;
        this.price = food.getPrice();
        this.order = order;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFoodId() { return foodId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }

    public Integer getQuantity() { return quantity != null ? quantity : 0; }
    public void setQuantity(Integer quantity) { this.quantity = quantity != null ? quantity : 0; }

    public Double getPrice() { return price != null ? price : 0.0; }
    public void setPrice(Double price) { this.price = price != null ? price : 0.0; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Food getFood() { return food; }
    public void setFood(Food food) {
        this.food = food;
        if (food != null) {
            this.foodId = food.getId();
            this.price = food.getPrice();
        }
    }
}

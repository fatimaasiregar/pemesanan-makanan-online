package com.example.demo.repository;

import com.example.demo.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Cari order berdasarkan user ID
    List<Order> findByUserId(Long userId);
    
    // Cari order berdasarkan status
    List<Order> findByStatus(String status);
    
    // Cari order dengan receiver name yang mengandung kata tertentu
    List<Order> findByReceiverNameContainingIgnoreCase(String receiverName);
    
    // Query untuk mendapatkan order dengan items
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.id = :orderId")
    Order findOrderWithItems(@Param("orderId") Long orderId);
    
    // Query untuk mendapatkan semua order dengan items
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems ORDER BY o.createdAt DESC")
    List<Order> findAllWithItems();
}
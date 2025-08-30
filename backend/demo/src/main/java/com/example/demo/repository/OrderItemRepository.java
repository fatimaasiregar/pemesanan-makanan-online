package com.example.demo.repository;

import com.example.demo.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Cari order items berdasarkan order ID
    List<OrderItem> findByOrderId(Long orderId);
    
    // Cari order items berdasarkan food ID
    List<OrderItem> findByFoodId(Long foodId);
    
    // Query untuk mendapatkan total penjualan per makanan
    @Query("SELECT oi.foodId, COUNT(oi) as totalOrders, SUM(oi.quantity) as totalQuantity " +
           "FROM OrderItem oi GROUP BY oi.foodId ORDER BY totalQuantity DESC")
    List<Object[]> findSalesReport();
    
    // Query untuk mendapatkan order items dengan informasi order
    @Query("SELECT oi FROM OrderItem oi JOIN FETCH oi.order WHERE oi.order.id = :orderId")
    List<OrderItem> findItemsWithOrder(@Param("orderId") Long orderId);
}
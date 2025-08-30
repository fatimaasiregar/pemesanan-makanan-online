package com.example.demo.repository;

import com.example.demo.model.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRepository extends JpaRepository<Food, Long> {
    Page<Food> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Food> findByNameContainingIgnoreCase(String search, Pageable pageable);
    Page<Food> findByCategoryIdAndNameContainingIgnoreCase(Long categoryId, String search, Pageable pageable);
}

package com.example.demo.service;

import com.example.demo.model.Food;
import com.example.demo.model.Restaurant;
import com.example.demo.model.Category;
import com.example.demo.repository.FoodRepository;
import com.example.demo.repository.RestaurantRepository;
import com.example.demo.repository.CategoryRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class FoodService {

    private final FoodRepository repo;
    private final RestaurantRepository restaurantRepo;
    private final CategoryRepository categoryRepo;

    public FoodService(FoodRepository repo, RestaurantRepository restaurantRepo, CategoryRepository categoryRepo) {
        this.repo = repo;
        this.restaurantRepo = restaurantRepo;
        this.categoryRepo = categoryRepo;
    }

    // ================= GET (Pagination + Search + Filter + Sort) ==================
    public Page<Food> getFoods(int page, int size, Long categoryId, String search, String sort) {
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        Sort.Direction direction = Sort.Direction.fromString(sortParams.length > 1 ? sortParams[1] : "asc");
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));

        boolean noSearch = (search == null || search.isBlank());
        if (categoryId == null && noSearch) {
            return repo.findAll(pageable);
        } else if (categoryId != null && noSearch) {
            return repo.findByCategoryId(categoryId, pageable);
        } else if (categoryId == null) {
            return repo.findByNameContainingIgnoreCase(search, pageable);
        } else {
            return repo.findByCategoryIdAndNameContainingIgnoreCase(categoryId, search, pageable);
        }
    }

    // ================= GET by ID ==================
    public Food getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // ================= CREATE ==================
    public Food create(Food food) {
        Long restaurantId = food.getRestaurant() != null ? food.getRestaurant().getId() : null;
        Long categoryId = food.getCategory() != null ? food.getCategory().getId() : null;

        if (restaurantId == null || categoryId == null) {
            throw new RuntimeException("Restaurant atau Category tidak boleh null");
        }

        Restaurant restaurant = restaurantRepo.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant tidak ditemukan"));
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category tidak ditemukan"));

        food.setRestaurant(restaurant);
        food.setCategory(category);

        return repo.save(food);
    }

    // ================= UPDATE ==================
    public Food update(Long id, Food foodDetails) {
        Food existingFood = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Food dengan ID " + id + " tidak ditemukan"));

        // update field
        existingFood.setName(foodDetails.getName());
        existingFood.setPrice(foodDetails.getPrice());

        if (foodDetails.getRestaurant() != null && foodDetails.getRestaurant().getId() != null) {
            Restaurant restaurant = restaurantRepo.findById(foodDetails.getRestaurant().getId())
                    .orElseThrow(() -> new RuntimeException("Restaurant tidak ditemukan"));
            existingFood.setRestaurant(restaurant);
        }

        if (foodDetails.getCategory() != null && foodDetails.getCategory().getId() != null) {
            Category category = categoryRepo.findById(foodDetails.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category tidak ditemukan"));
            existingFood.setCategory(category);
        }

        return repo.save(existingFood);
    }

    // ================= DELETE ==================
    public void delete(Long id) {
        Food food = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Food dengan ID " + id + " tidak ditemukan"));
        repo.delete(food);
    }
}

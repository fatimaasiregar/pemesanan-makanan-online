package com.example.demo.controller;

import com.example.demo.model.Food;
import com.example.demo.model.Category;
import com.example.demo.model.Restaurant;
import com.example.demo.service.FoodService;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.RestaurantRepository;
import com.example.demo.dto.PageResponse; // ✅ tambahkan import
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodController {

    private final FoodService service;
    private final RestaurantRepository restaurantRepo;
    private final CategoryRepository categoryRepo;

    public FoodController(FoodService service, RestaurantRepository restaurantRepo, CategoryRepository categoryRepo) {
        this.service = service;
        this.restaurantRepo = restaurantRepo;
        this.categoryRepo = categoryRepo;
    }

    // ================= GET ALL ==================
    @GetMapping
    public ResponseEntity<PageResponse<Food>> getFoods(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "40") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "name,asc") String sort
    ) {
        Page<Food> foods = service.getFoods(page, size, categoryId, search, sort);

        PageResponse<Food> response = new PageResponse<>(
                foods.getContent(),
                foods.getNumber(),
                foods.getSize(),
                foods.getTotalElements(),
                foods.getTotalPages()
        );

        return ResponseEntity.ok(response);
    }

    // ================= GET BY ID ==================
    @GetMapping("/{id}")
    public ResponseEntity<Food> getById(@PathVariable Long id) {
        Food food = service.getById(id);
        if (food == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(food);
    }

    // ================= DTO ==================
    public static class FoodDTO {
        public String name;
        public Double price;
        public Long restaurantId;
        public Long categoryId;
    }

    // ================= CREATE ==================
    @PostMapping
    public ResponseEntity<Food> create(@RequestBody FoodDTO dto) {
        Restaurant restaurant = restaurantRepo.findById(dto.restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant tidak ditemukan"));
        Category category = categoryRepo.findById(dto.categoryId)
                .orElseThrow(() -> new RuntimeException("Category tidak ditemukan"));

        Food food = new Food();
        food.setName(dto.name);
        food.setPrice(dto.price);
        food.setRestaurant(restaurant);
        food.setCategory(category);

        Food saved = service.create(food);
        return ResponseEntity.ok(saved);
    }

    // ================= UPDATE ==================
    @PutMapping("/{id}")
    public ResponseEntity<Food> update(@PathVariable Long id, @RequestBody FoodDTO dto) {
        Food foodDetails = new Food();
        foodDetails.setName(dto.name);
        foodDetails.setPrice(dto.price);

        if (dto.restaurantId != null) {
            Restaurant restaurant = restaurantRepo.findById(dto.restaurantId)
                    .orElseThrow(() -> new RuntimeException("Restaurant tidak ditemukan"));
            foodDetails.setRestaurant(restaurant);
        }

        if (dto.categoryId != null) {
            Category category = categoryRepo.findById(dto.categoryId)
                    .orElseThrow(() -> new RuntimeException("Category tidak ditemukan"));
            foodDetails.setCategory(category);
        }

        Food updated = service.update(id, foodDetails);
        return ResponseEntity.ok(updated);
    }

    // ================= DELETE ==================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    } 
}

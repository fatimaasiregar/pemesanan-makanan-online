package com.example.demo.controller;

import com.example.demo.model.Review;
import com.example.demo.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Tambah review
    @PostMapping
    public Review addReview(@RequestBody Review review) {
        review.setReviewDate(LocalDateTime.now());
        return reviewService.addReview(review);
    }

    // Ambil semua review berdasarkan restaurant
    @GetMapping("/restaurant/{restaurantId}")
    public List<Review> getReviewsByRestaurant(@PathVariable Long restaurantId) {
        return reviewService.getReviewsByRestaurant(restaurantId);
    }

    // Ambil semua review restoran (admin)
    @GetMapping("/restaurant/all")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // Ambil semua review berdasarkan user
    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUser(@PathVariable Long userId) {
        return reviewService.getReviewsByUser(userId);
    }

    // Ambil semua review user login (frontend user)
    @GetMapping("/user")
    public List<Review> getReviewsOfLoggedInUser(@RequestParam Long userId) {
        return reviewService.getReviewsByUser(userId);
    }

    // Hapus review
    @DeleteMapping("/{reviewId}")
    public void deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
    }
}

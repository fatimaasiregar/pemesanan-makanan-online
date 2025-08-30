package com.example.demo.service;

import com.example.demo.model.Review;
import com.example.demo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // Tambah review
    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    // Ambil semua review berdasarkan restaurant
    public List<Review> getReviewsByRestaurant(Long restaurantId) {
        return reviewRepository.findByRestaurantId(restaurantId);
    }

    // Ambil semua review (admin)
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Ambil semua review berdasarkan user
    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    // Hapus review
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}

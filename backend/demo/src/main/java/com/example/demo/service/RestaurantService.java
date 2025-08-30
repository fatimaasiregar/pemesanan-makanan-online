// RestaurantService.java
package com.example.demo.service;

import com.example.demo.model.Restaurant;
import com.example.demo.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {
    private final RestaurantRepository repo;

    public RestaurantService(RestaurantRepository repo) {
        this.repo = repo;
    }

    public List<Restaurant> getAll() {
        return repo.findAll();
    }

    public Optional<Restaurant> getById(Long id) {
        return repo.findById(id);
    }

    public Restaurant save(Restaurant restaurant) {
        return repo.save(restaurant);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}

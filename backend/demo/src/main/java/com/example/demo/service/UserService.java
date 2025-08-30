package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) { this.userRepository = userRepository; }

    // REGISTER USER
    public User register(String username, String email, String password) throws Exception {
        if (userRepository.findByUsername(username).isPresent()) throw new Exception("Username sudah digunakan");
        if (userRepository.findByEmail(email).isPresent()) throw new Exception("Email sudah digunakan");

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password); // tanpa bcrypt
        user.setRole("USER");
        return userRepository.save(user);
    }

    // LOGIN USER / ADMIN
    public User login(String username, String password) throws Exception {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) throw new Exception("User tidak ditemukan");

        User user = userOpt.get();
        if (!user.getPassword().equals(password)) throw new Exception("Password salah");

        return user;
    }

    public Iterable<User> getAllUsers() { return userRepository.findAll(); }
}

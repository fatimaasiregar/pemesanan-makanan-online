package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) { this.userService = userService; }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User newUser = userService.register(user.getUsername(), user.getEmail(), user.getPassword());
            Map<String, Object> res = new HashMap<>();
            res.put("id", newUser.getId());
            res.put("username", newUser.getUsername());
            res.put("role", newUser.getRole());
            res.put("message", "Register berhasil");
            return ResponseEntity.status(201).body(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User loggedUser = userService.login(user.getUsername(), user.getPassword());
            Map<String, Object> res = new HashMap<>();
            res.put("id", loggedUser.getId());
            res.put("username", loggedUser.getUsername());
            res.put("role", loggedUser.getRole());
            res.put("message", "Login berhasil");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

package com.alhamad.doc_api.controller;

import java.util.Optional;

import org.apache.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alhamad.doc_api.model.LoginResponse;
import com.alhamad.doc_api.model.UserCreationModel;
import com.alhamad.doc_api.model.UserCreationResponse;
import com.alhamad.doc_api.model.UserDeletionModel;
import com.alhamad.doc_api.model.UserDeletionResponse;
import com.alhamad.doc_api.model.UserLoginModel;
import com.alhamad.doc_api.model.UserModel;
import com.alhamad.doc_api.service.UserService;
import com.google.gson.Gson;
import com.google.gson.JsonParser;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger log = Logger.getLogger(UserController.class);
    private final UserService userService;
    private final Gson gson;

    public UserController(UserService userService, Gson gson) {
        this.userService = userService;
        this.gson = gson;
    }

    // =======================
    // Get User by Username
    // =======================
    @GetMapping("/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        log.info("Fetching user by username: " + gson.toJson(username));
        try {
            Optional<UserModel> optionalUser = userService.getUserByUsername(username);

            if (optionalUser.isPresent()) {
                UserModel user = optionalUser.get();
                log.info("User found: " + gson.toJson(user));
                return ResponseEntity.ok(user);
            } else {
                log.info("User not found: " + gson.toJson(username));
                return ResponseEntity.status(404).body("{\"error\":\"User not found\"}");
            }

        } catch (Exception e) {
            log.error("Error fetching user: " + gson.toJson(username), e);
            return ResponseEntity.status(500).body("{\"error\":\"Internal server error\"}");
        }
    }

    // =======================
    // Login User
    // =======================
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginModel loginRequest) {
        log.info("Login attempt: " + gson.toJson(loginRequest));
        String username = loginRequest.getUsername();
        String password = loginRequest.getPasswordHash();

        try {
            boolean success = userService.login(username, password);
            if (success) {
                String token = java.util.UUID.randomUUID().toString();
                userService.setToken(username, token);

                log.info("Login successful for user: " + gson.toJson(username) + ", token: " + gson.toJson(token));
                LoginResponse response = new LoginResponse("success", token);
                return ResponseEntity.ok(response);
            } else {
                log.info("Login failed for user: " + gson.toJson(username));
                LoginResponse response = new LoginResponse("failed", null);
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            log.error("Error during login for user: " + gson.toJson(username), e);
            LoginResponse response = new LoginResponse("error", null);
            return ResponseEntity.status(500).body(response);
        }
    }

    // =======================
    // Logout User
    // =======================
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestHeader("Authorization") String token) {
        log.info("Logout attempt with token: " + gson.toJson(token));
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Optional<UserModel> optionalUser = userService.validateToken(token);

            if (optionalUser.isPresent()) {
                String username = optionalUser.get().getUsername();
                userService.logout(username);
                log.info("User logged out: " + gson.toJson(username));
                LoginResponse response = new LoginResponse("success", token);
                return ResponseEntity.ok(response);
            } else {
                log.info("Invalid token during logout: " + gson.toJson(token));
                LoginResponse response = new LoginResponse("failed", null);
                return ResponseEntity.status(401).body(response);
            }

        } catch (Exception e) {
            log.error("Error during logout", e);
            LoginResponse response = new LoginResponse("error", null);
            return ResponseEntity.status(500).body(response);
        }
    }

    // =======================
    // Hash Password Only
    // =======================
    @PostMapping("/hash-password")
    public ResponseEntity<?> hashPasswordOnly(@RequestBody String passwordJson) {
        try {
            String password = JsonParser.parseString(passwordJson)
                    .getAsJsonObject()
                    .get("password")
                    .getAsString();

            log.info("Hashing password request: " + gson.toJson(password));

            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body("{\"error\":\"Password is required\"}");
            }

            String passwordHash = userService.hashPasswordForStorage(password);
            log.info("Password hashed successfully: " + gson.toJson(passwordHash));

            return ResponseEntity.ok("{\"passwordHash\":\"" + passwordHash + "\"}");
        } catch (Exception e) {
            log.error("Error hashing password", e);
            return ResponseEntity.status(500).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    // =======================
    // Create User
    // =======================
    @PostMapping("/create")
    public ResponseEntity<UserCreationResponse> createUser(@RequestBody UserCreationModel request) {
        try {
            log.info("Create user request: " + gson.toJson(request));

            String result = userService.createUser(request);

            log.info("Create user result: " + gson.toJson(result));

            if (result.startsWith("Error")) {
                UserCreationResponse response = new UserCreationResponse(400, result);
                log.error("Error creating user: " + gson.toJson(response));
                return ResponseEntity.badRequest().body(response);
            } else {
                UserCreationResponse response = new UserCreationResponse(200, "Success");
                log.info("User created successfully: " + gson.toJson(response));
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            log.error("Unexpected error during user creation: " + gson.toJson(request), e);
            UserCreationResponse response = new UserCreationResponse(500, "Internal server error");
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // =======================
    // Delete User by Username
    // =======================
    @PostMapping("/delete-user")
    public ResponseEntity<UserDeletionResponse> deleteUser(@RequestBody UserDeletionModel request) {
        try {
            String username = request.getUsername();
            log.info("Delete user request: " + gson.toJson(request));

            UserDeletionResponse response = userService.deleteUserByUsername(username);

            if (response.getStatus() == 200) {
                log.info("Delete user success: " + gson.toJson(response));
                return ResponseEntity.ok(response);
            } else if (response.getStatus() == 400) {
                log.info("Delete user failed: " + gson.toJson(response));
                return ResponseEntity.badRequest().body(response);
            } else {
                log.error("Delete user error: " + gson.toJson(response));
                return ResponseEntity.status(500).body(response);
            }
        } catch (Exception e) {
            log.error("Unexpected error deleting user: " + gson.toJson(request), e);
            UserDeletionResponse response = new UserDeletionResponse(500, "Internal server error");
            return ResponseEntity.status(500).body(response);
        }
    }
}

package com.alhamad.doc_api.service;

import java.sql.ResultSet;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.alhamad.doc_api.interfaces.UserInterface;
import com.alhamad.doc_api.model.UserCreationModel;
import com.alhamad.doc_api.model.UserDeletionResponse;
import com.alhamad.doc_api.model.UserModel;
import com.google.gson.Gson;

@Service
public class UserService implements UserInterface {

    private static final Logger log = Logger.getLogger(UserService.class);
    private final JdbcTemplate jdbcTemplate;
    private final Gson gson;

    public UserService(JdbcTemplate jdbcTemplate, Gson gson) {
        this.jdbcTemplate = jdbcTemplate;
        this.gson = gson;
    }

    // =======================
    // Login
    // =======================
    @Override
    public boolean login(String username, String passwordFromClient) {
        try {
            log.info("Login attempt for username: " + gson.toJson(username));

            // Hash the password from client for comparison
            String hashedPassword = hashPasswordForStorage(passwordFromClient);

            // Call PostgreSQL function login_user(username, password_hash)
            String sql = "SELECT login_user(?, ?)";
            Boolean success = jdbcTemplate.queryForObject(sql, Boolean.class, username, passwordFromClient);

            if (Boolean.TRUE.equals(success)) {
                // Generate token
                String token = UUID.randomUUID().toString();

                // Use setToken to store it via PostgreSQL function
                setToken(username, token);

                log.info("Login successful, token issued: " + gson.toJson(token));
            } else {
                log.info("Login failed for username: " + gson.toJson(username));
            }

            return Boolean.TRUE.equals(success);

        } catch (Exception e) {
            log.error("Error during login for username: " + gson.toJson(username), e);
            return false;
        }
    }

    // =======================
    // Create User
    // =======================
    public String createUser(UserCreationModel userRequest) {
        try {
            log.info("Creating user: " + gson.toJson(userRequest));

            String sql = "SELECT create_user(?, ?, ?, ?, ?)";
            String result = jdbcTemplate.queryForObject(
                    sql,
                    String.class,
                    userRequest.getEmployeeID(),
                    userRequest.getUsername(),
                    userRequest.getEmail(),
                    hashPasswordForStorage(userRequest.getPasswordHash()),
                    userRequest.getRole() != null ? userRequest.getRole() : "user"
            );

            log.info("User creation result: " + gson.toJson(result));
            return result;

        } catch (Exception e) {
            log.error("Error creating user: " + gson.toJson(userRequest), e);
            return "Error: Unable to create user.";
        }
    }
    
    // =======================
    // Delete User by Username
    // =======================
    public UserDeletionResponse deleteUserByUsername(String username) {
        try {
            log.info("Attempting to delete user: " + gson.toJson(username));

            String sql = "SELECT * FROM del_user_by_username(?)";
            // Execute function; returns list of users (should be at most one)
            List<?> deletedUsers = jdbcTemplate.queryForList(sql, username);

            if (deletedUsers.isEmpty()) {
                String msg = "User not found or already deleted";
                log.info(msg + ": " + gson.toJson(username));
                return new UserDeletionResponse(400, msg);
            } else {
                log.info("User successfully marked deleted: " + gson.toJson(username));
                return new UserDeletionResponse(200, "Success");
            }
        } catch (Exception e) {
            log.error("Error deleting user: " + gson.toJson(username), e);
            return new UserDeletionResponse(500, "Internal server error");
        }
    }

    // =======================
    // Get User by Username
    // =======================
    @Override
    public Optional<UserModel> getUserByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ? AND is_deleted = 0";
        try {
            UserModel user = jdbcTemplate.queryForObject(sql, (ResultSet rs, int rowNum) -> new UserModel(
                    rs.getString("employee_id"),
                    rs.getString("username"),
                    rs.getString("email"),
                    rs.getString("role"),
                    rs.getTimestamp("updated_at") != null
                            ? rs.getTimestamp("updated_at").toLocalDateTime()
                            : null
            ), username);

            log.info("Fetched user by username: " + gson.toJson(user));
            return Optional.ofNullable(user);

        } catch (EmptyResultDataAccessException e) {
            log.info("User not found for username: " + gson.toJson(username));
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error fetching user by username: " + gson.toJson(username), e);
            return Optional.empty();
        }
    }

    // =======================
    // Token Handling
    // =======================
    @Override
    public void setToken(String username, String token) {
        try {
            log.info("Setting token for user: " + gson.toJson(username));

            // Call PostgreSQL function set_user_token(username, token)
            String sql = "SELECT set_user_token(?, ?)";
            Boolean success = jdbcTemplate.queryForObject(sql, Boolean.class, username, token);

            if (Boolean.TRUE.equals(success)) {
                log.info("Token successfully set for user: " + gson.toJson(username) + ", token: " + gson.toJson(token));
            } else {
                log.info("Failed to set token (user not found or deleted): " + gson.toJson(username));
            }

        } catch (Exception e) {
            log.error("Error setting token for user: " + gson.toJson(username), e);
        }
    }

    @Override
    public Optional<String> getToken(String username) {
        try {
            String sql = "SELECT token FROM users WHERE username = ? AND is_deleted = 0";
            String token = jdbcTemplate.queryForObject(sql, String.class, username);
            log.info("Fetched token for user: " + gson.toJson(username));
            return Optional.ofNullable(token);
        } catch (EmptyResultDataAccessException e) {
            log.info("No token found for user: " + gson.toJson(username));
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error fetching token for user: " + gson.toJson(username), e);
            return Optional.empty();
        }
    }

    @Override
    public Optional<UserModel> validateToken(String token) {
        try {
            String sql = "SELECT * FROM users WHERE token = ?";
            UserModel user = jdbcTemplate.queryForObject(sql, (rs, rowNum) -> new UserModel(
                    rs.getString("employee_id"),
                    rs.getString("username"),
                    rs.getString("email"),
                    rs.getString("role"),
                    rs.getTimestamp("updated_at") != null
                            ? rs.getTimestamp("updated_at").toLocalDateTime()
                            : null
            ), token);

            log.info("Validated token, user: " + gson.toJson(user));
            return Optional.ofNullable(user);

        } catch (EmptyResultDataAccessException e) {
            log.info("Token not valid: " + gson.toJson(token));
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error validating token: " + gson.toJson(token), e);
            return Optional.empty();
        }
    }

    // =======================
    // Logout
    // =======================
    public void logout(String username) {
        try {
            String sql = "UPDATE users SET token = NULL, token_created_at = NULL WHERE username = ? AND is_deleted = 0";
            jdbcTemplate.update(sql, username);
            log.info("User logged out: " + gson.toJson(username));
        } catch (Exception e) {
            log.error("Error logging out user: " + gson.toJson(username), e);
        }
    }

    // =======================
    // Password Hashing
    // =======================
    public String hashPasswordForStorage(String plainPassword) {
        String hashed = BCrypt.hashpw(plainPassword, BCrypt.gensalt(12));
        log.info("Password hashed for storage: " + gson.toJson(hashed));
        return hashed;
    }
}

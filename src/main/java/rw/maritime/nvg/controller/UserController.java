package rw.maritime.nvg.controller;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import rw.maritime.nvg.model.Role;
import rw.maritime.nvg.model.User;
import rw.maritime.nvg.security.jwt.JwtUtil;
import rw.maritime.nvg.service.IUserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final IUserService userService;
    private final JwtUtil jwtUtil;

    public UserController(IUserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /** Register a user. Default role = USER if not set */
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        try {
            if (user.getRole() == null) {
                user.setRole(Role.USER);
            }

            userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error during user registration: " + e.getMessage());
        }
    }

    /** User login and JWT token generation */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            boolean isAuthenticated = userService.authenticateUser(user.getEmail(), user.getPassword());

            if (isAuthenticated) {
                User authenticatedUser = userService.getUser(user.getEmail());
                String token = jwtUtil.generateToken(authenticatedUser);

                Map<String, String> response = new HashMap<>();
                response.put("message", "Login successful!");
                response.put("token", token);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during login: " + e.getMessage());
        }
    }

    /** Only ADMIN can view all users */
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token required");
            }

            String token = authHeader.substring(7);
            Claims claims = jwtUtil.extractClaims(token);
            String role = claims.get("role", String.class);

            if (!Role.ADMIN.name().equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admins only");
            }

            List<User> users = userService.getUsers();
            return ResponseEntity.ok(users);

        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching users: " + e.getMessage());
        }
    }

    /** Accessible by any authenticated user to view their own data */
    @GetMapping("/{email}")
    public ResponseEntity<?> getUserByEmail(
            @PathVariable("email") String email,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token required");
            }

            String token = authHeader.substring(7);
            Claims claims = jwtUtil.extractClaims(token);
            String requesterEmail = claims.getSubject();
            String role = claims.get("role", String.class);

            // Only ADMIN or owner of the account can view
            if (!email.equals(requesterEmail) && !Role.ADMIN.name().equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            User theUser = userService.getUser(email);
            return ResponseEntity.ok(theUser);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found: " + e.getMessage());
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user");
        }
    }

    /** Only ADMIN can delete any user, except their own account */
    @DeleteMapping("/delete/{email}")
    public ResponseEntity<String> deleteUser(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("email") String email) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is required");
            }

            String token = authHeader.substring(7);
            Claims claims = jwtUtil.extractClaims(token);

            String requesterEmail = claims.getSubject();
            String role = claims.get("role", String.class);

            if (!Role.ADMIN.name().equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only administrators can delete users");
            }

            if (email.equals(requesterEmail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot delete your own admin account");
            }

            userService.deleteUser(email);
            return ResponseEntity.ok("User deleted successfully");

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found: " + e.getMessage());
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting user: " + e.getMessage());
        }
    }
}

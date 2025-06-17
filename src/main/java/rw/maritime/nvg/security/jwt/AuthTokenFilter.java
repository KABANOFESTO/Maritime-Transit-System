package rw.maritime.nvg.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import rw.maritime.nvg.security.User.MaritimeDetailService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtils;

    @Autowired
    private MaritimeDetailService userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            
            if (jwt == null) {
                logger.debug("No JWT token found in request");
                filterChain.doFilter(request, response);
                return;
            }

            logger.debug("Found JWT token in request");

            if (!jwtUtils.validateToken(jwt)) {
                logger.warn("Invalid JWT token");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                return;
            }

            String email = jwtUtils.getUserNameFromToken(jwt);
            logger.debug("Extracted email from JWT: {}", email);

            UserDetails userDetails;
            try {
                userDetails = userDetailsService.loadUserByUsername(email);
                logger.debug("Successfully loaded user details for: {}", email);
            } catch (UsernameNotFoundException e) {
                logger.error("User not found with email: {}", email);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
                return;
            }

            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()  // Include user authorities
                );

            authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.debug("Set authentication in security context for user: {}", email);

        } catch (Exception e) {
            logger.error("Authentication error: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        
        return null;
    }
}
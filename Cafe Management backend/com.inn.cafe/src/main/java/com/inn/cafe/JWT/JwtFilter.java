package com.inn.cafe.JWT;

import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomerUsersDetailsService service;

    Claims claims = null;
    private String userName = null;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();

        // Skip paths for login, signup, etc.
        if (path.equals("/user/login") || path.equals("/user/forgotPassword") || path.equals("/user/signup") ||
                path.equals("/customer/login") || path.equals("/customer/register") || path.equals("/customer/forgot") || path.equals("/customer/reset")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader("Authorization");
        String token = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7); // Extract token

            if (token != null && !token.trim().isEmpty()) {
                try {
                    userName = jwtUtil.extractUsername(token); // Extract username from token
                    claims = jwtUtil.extractAllClaims(token); // Extract claims
                } catch (ExpiredJwtException e) {
                    // Token has expired
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT token is expired");
                    return;
                } catch (UnsupportedJwtException e) {
                    // Unsupported JWT format
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT token is unsupported");
                    return;
                } catch (MalformedJwtException e) {
                    // Malformed JWT
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT token is malformed");
                    return;
                } catch (SignatureException e) {
                    // Invalid signature
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT signature");
                    return;
                } catch (Exception e) {
                    // Other errors (generic)
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                    return;
                }
            }
        }

        // If the token is valid and the user is authenticated
        if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = service.loadUserByUsername(userName);
            if (jwtUtil.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response); // Proceed with the filter chain
    }

    // Role checks
    public Boolean isAdmin() {
        return "admin".equalsIgnoreCase((String) claims.get("role"));
    }

    public Boolean isUser() {
        return "user".equalsIgnoreCase((String) claims.get("role"));
    }

    public Boolean isCustomer() {
        return "customer".equalsIgnoreCase((String) claims.get("role"));
    }

    public String getCurrentUser() {
        return userName;
    }

    public String getCurrentUserEmail(){
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if(authentication != null && authentication.isAuthenticated()) {
                return authentication.getName();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}

package com.example.job.portal.Security;


import com.example.job.portal.Service.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTAuthFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        System.out.println("Filtering path: " + path);


        // Skip JWT validation for public endpoints
        if (path.startsWith("/api/auth/forgot-password") || path.startsWith("/api/auth/reset-password") || path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register-seeker") || path.startsWith("/api/auth/register-employer")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;
        System.out.println("Authorization header: " + authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Missing or invalid Authorization header");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        System.out.println("JWT extracted: " + jwt);

        try {
            username = jwtService.extractUsername(jwt);
            System.out.println("Username extracted from JWT: " + username);
        } catch (Exception e) {
            System.out.println("Failed to extract username from JWT: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails;
            try {
                userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("Loaded userDetails: " + userDetails.getUsername());
            } catch (Exception e) {
                System.out.println("Failed to load userDetails: " + e.getMessage());
                filterChain.doFilter(request, response);
                return;
            }

            //check if user is active
            if (userDetails instanceof CustomUserDetails) {
                String accountStatus = ((CustomUserDetails) userDetails).getAccountStatus();
                if (!"active".equalsIgnoreCase(accountStatus)) {
                    // User is inactive so reject request
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("Account is inactive. Access denied.");
                    return;
                }
            } else {
                System.out.println("UserDetails is not instance of CustomUserDetails");

            }


            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Authentication set in SecurityContext");
            } else {
                System.out.println("JWT token is invalid");
            }
        } else {
            System.out.println("Username is null or context already has authentication");
        }

        filterChain.doFilter(request, response);
    }
}

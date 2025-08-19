package com.example.job.portal.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.function.Function;

@Component
public class JWTService {

    // Secret key used to sign and verify JWT tokens
    private static final String SECRET_KEY = System.getenv("JWT_SECRET");

    // Extract username (subject) from JWT token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Generic method to extract any claim from JWT token using a resolver function
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extract all claims (payload data) from the JWT token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes())) // use secret key for validation
                .build().parseClaimsJws(token) // parse and validate JWT
                .getBody(); // return claims (payload)
    }

    // Generate JWT token for a given user
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder().setSubject(userDetails.getUsername()) // set username as subject
                .setIssuedAt(new Date(System.currentTimeMillis())) // token issue time
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours expiration
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes())) // sign using secret key
                .compact(); // build token string
    }

    // Validate if the token is valid for the given user
    public boolean isTokenValid(String token, UserDetails userDetails) {
        // Check username matches and token is not expired
        return extractUsername(token).equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // Check if the token is expired
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date()); // compare expiration with current date
    }

}

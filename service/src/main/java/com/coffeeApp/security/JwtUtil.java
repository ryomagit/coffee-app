package com.coffeeApp.security;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {

	private final long expirationTime = 3600000; // 1時間

	private final JwtKeyProvider keyProvider;

	@Autowired
	public JwtUtil(JwtKeyProvider keyProvider) {
		this.keyProvider = keyProvider;
	}

	public String generateToken(String mailAddress) {
		return Jwts.builder()
				.setSubject(mailAddress)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + expirationTime))
				.signWith(keyProvider.getSecretKey(), SignatureAlgorithm.HS256)
				.compact();
	}

	// トークン検証
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(keyProvider.getSecretKey()).build().parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	// トークンからメールアドレスを取得
	public String getEmailFromToken(String token) {
		Claims claims = Jwts.parserBuilder().setSigningKey(keyProvider.getSecretKey()).build().parseClaimsJws(token)
				.getBody();
		return claims.getSubject();
	}
}

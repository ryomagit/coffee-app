package com.coffeeApp.security;

import java.security.Key;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.security.Keys;

@Component
public class JwtKeyProvider {

	private final Key secretKey;

	public JwtKeyProvider(@Value("${jwt.secret-key}") String secretKeyString) {
		// Base64 でエンコードされた鍵をデコードして Key オブジェクトを生成
		byte[] decodedKey = Base64.getDecoder().decode(secretKeyString);
		this.secretKey = Keys.hmacShaKeyFor(decodedKey);
	}

	public Key getSecretKey() {
		return secretKey;
	}
}

package com.coffeeApp;

import java.util.Base64;

import javax.crypto.SecretKey;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class KeyGenerator {
	public static void main(String[] args) {
		// HS256 用の鍵を生成
		SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

		// Base64 でエンコード
		String base64EncodedKey = Base64.getEncoder().encodeToString(key.getEncoded());
		byte[] decodedKey = Base64.getDecoder().decode(base64EncodedKey);

		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String password = "password123";
		String hashedPassword = encoder.encode(password);
		System.out.println("Generated Key: " + base64EncodedKey);
		System.out.println(decodedKey.length * 8);
		System.out.println("hashedPassword: " + hashedPassword);
	}
}

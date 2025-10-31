package com.coffeeApp.security;

import java.util.Arrays;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtUtil {

	private final long expirationTime = 600000; // 10分
	//	private final long expirationTime = 60000; // 1分
	private final long longExpirationTime = 3600000; //1時間

	private final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

	private final JwtKeyProvider keyProvider;

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

	public String generateRefreshToken(String mailAddress) {
		return Jwts.builder()
				.setSubject(mailAddress)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + longExpirationTime))
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

	/**
	 * クッキーからリフレッシュトークンを取得するメソッド
	 *
	 * @param request HttpServletRequest
	 * @return リフレッシュトークン（存在しない場合は null）
	 */
	public String extractRefreshTokenFromCookie(HttpServletRequest request) {
		// クッキーが存在しない場合は null を返す
		if (request.getCookies() == null) {
			return null;
		}

		// クッキーを走査して "refreshToken" クッキーを探す
		return Arrays.stream(request.getCookies())
				.filter(cookie -> REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName())) // クッキー名が "refreshToken" の場合
				.map(Cookie::getValue) // クッキーの値を取得
				.findFirst() // 最初に見つかった値を返す
				.orElse(null); // 存在しない場合は null を返す
	}
}

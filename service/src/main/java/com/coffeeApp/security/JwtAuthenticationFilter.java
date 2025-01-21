package com.coffeeApp.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtKeyProvider keyProvider;

	public JwtAuthenticationFilter(JwtKeyProvider keyProvider) {
		this.keyProvider = keyProvider;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String token = request.getHeader("Authorization");

		if (token != null && token.startsWith("Bearer ")) {
			token = token.substring(7);
			try {
				// JwtParserのインスタンスを作成
				JwtParser jwtParser = Jwts.parserBuilder()
						.setSigningKey(keyProvider.getSecretKey())
						.build();

				// JWTを解析してクレームを取得
				Claims claims = jwtParser.parseClaimsJws(token).getBody();

				String mailAddress = claims.getSubject();
				if (mailAddress != null) {
					// 認証情報をSpring Securityのコンテキストに設定
					SecurityContextHolder.getContext().setAuthentication(
							new UsernamePasswordAuthenticationToken(mailAddress, null, Collections.emptyList()));
				}
			} catch (Exception e) {
				// JWTの解析や検証に失敗した場合、セキュリティコンテキストをクリア
				SecurityContextHolder.clearContext();
			}
		}

		// 次のフィルタを実行
		filterChain.doFilter(request, response);
	}
}

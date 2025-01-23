package com.coffeeApp.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;

	public JwtAuthenticationFilter(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String token = request.getHeader("Authorization");
		System.out.println(token);

		if (token != null && token.startsWith("Bearer ")) {
			token = token.substring(7);
			try {
				if (jwtUtil.validateToken(token)) {
					String email = jwtUtil.getEmailFromToken(token);

					// CustomUserDetails を作成して SecurityContext に保存
					CustomUserDetails userDetails = new CustomUserDetails(email);
					UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
							userDetails, null, null);
					SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			} catch (ExpiredJwtException ex) {
				SecurityContextHolder.clearContext(); // SecurityContext をクリア
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.getWriter().write("Token has expired");
				response.getWriter().flush();
				return; // フィルタチェーンを中断
			} catch (Exception ex) {
				// その他のエラー
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().write("An unexpected error occurred");
				response.getWriter().flush(); // 必要に応じて明示的にフラッシュ
			}
		} else {
			System.out.println("No Authorization header or invalid format");
		}

		// 次のフィルタを実行
		filterChain.doFilter(request, response);
	}
}

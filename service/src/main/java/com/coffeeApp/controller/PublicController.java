package com.coffeeApp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coffeeApp.dto.LoginRequest;
import com.coffeeApp.dto.Recipe;
import com.coffeeApp.dto.SigninRequest;
import com.coffeeApp.exception.BusinessException;
import com.coffeeApp.security.CustomUserDetails;
import com.coffeeApp.security.JwtUtil;
import com.coffeeApp.service.PublicService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/public")
public class PublicController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private PublicService service;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
		log.info("Login attempt: mailAddress={},password={}", loginRequest.getMailAddress(),
				loginRequest.getPassword());
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						loginRequest.getMailAddress(),
						loginRequest.getPassword()));

		String token = jwtUtil.generateToken(authentication.getName());
		String refreshToken = jwtUtil.generateRefreshToken(authentication.getName());
		ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
				.httpOnly(true)
				.secure(true)
				.path("/")
				.maxAge(60 * 60)
				.build();
		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
				.body(Map.of("accessToken", token));
	}

	@PostMapping("/signin")
	public ResponseEntity<?> signin(@RequestBody SigninRequest signinRequest) throws BusinessException {
		service.createAccount(signinRequest);
		return ResponseEntity.ok(null);
	}

	@PostMapping("/all")
	public List<Recipe> all(@AuthenticationPrincipal CustomUserDetails userDetails) throws BusinessException {
		String email = (userDetails != null) ? userDetails.getEmailAddress() : null;
		return service.getRecipesWithDetails(email);
	}

	@PostMapping("/refresh-token")
	public ResponseEntity<?> refreshAccessToken(HttpServletRequest request) {
		String refreshToken = jwtUtil.extractRefreshTokenFromCookie(request);

		if (refreshToken != null && jwtUtil.validateToken(refreshToken)) {
			String email = jwtUtil.getEmailFromToken(refreshToken);
			String newAccessToken = jwtUtil.generateToken(email);

			return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
		}

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token");
	}
}

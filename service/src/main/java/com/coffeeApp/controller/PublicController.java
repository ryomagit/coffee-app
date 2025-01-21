package com.coffeeApp.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.coffeeApp.security.JwtUtil;
import com.coffeeApp.service.PublicService;

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
	public String login(@RequestBody LoginRequest loginRequest) {
		log.info("Login attempt: mailAddress={},password={}", loginRequest.getMailAddress(),
				loginRequest.getPassword());
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						loginRequest.getMailAddress(),
						loginRequest.getPassword()));

		String token = jwtUtil.generateToken(authentication.getName());
		return token;
	}

	@PostMapping("/signin")
	public ResponseEntity<?> signin(@RequestBody SigninRequest signinRequest) throws BusinessException {
		service.createAccount(signinRequest);
		return ResponseEntity.ok(null);
	}

	@PostMapping("/all")
	public List<Recipe> all(@AuthenticationPrincipal String mailAddress // SecurityContext から取得
	) throws BusinessException {
		return new ArrayList<Recipe>();
	}
}

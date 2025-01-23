package com.coffeeApp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coffeeApp.dto.FavoriteRequest;
import com.coffeeApp.dto.FavoriteResponse;
import com.coffeeApp.security.JwtUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/private")
public class PrivateController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtil jwtUtil;

	@PostMapping("/favorite")
	public FavoriteResponse handleFavorite(FavoriteRequest req) {
		return null;
	}

}

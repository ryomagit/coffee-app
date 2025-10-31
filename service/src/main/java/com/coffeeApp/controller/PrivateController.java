package com.coffeeApp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coffeeApp.dto.DeleteRequest;
import com.coffeeApp.dto.DeleteResponse;
import com.coffeeApp.dto.FavoriteRequest;
import com.coffeeApp.dto.FavoriteResponse;
import com.coffeeApp.dto.Recipe;
import com.coffeeApp.exception.BusinessException;
import com.coffeeApp.security.CustomUserDetails;
import com.coffeeApp.security.JwtUtil;
import com.coffeeApp.service.PrivateService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/private")
public class PrivateController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private PrivateService service;

	@PostMapping("/favorite")
	public FavoriteResponse handleFavorite(@AuthenticationPrincipal CustomUserDetails userDetails,
			@RequestBody FavoriteRequest req) {
		String email = userDetails.getEmailAddress();
		return service.handleFavorite(email, req);
	}

	@PostMapping("/delete")
	public DeleteResponse handleDelete(@RequestBody DeleteRequest req) {
		return service.handleDelete(req);
	}

	@PostMapping("/add")
	public Recipe handleAddRecipe(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody Recipe req)
			throws BusinessException {
		String email = userDetails.getEmailAddress();

		return service.addRecipe(email, req);
	}

	@PostMapping("/edit")
	public Recipe handleEditRecipe(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody Recipe req)
			throws BusinessException {
		String email = userDetails.getEmailAddress();
		if (req.getSteps() == null) {
			log.debug("Steps are null!");
		} else {
			req.getSteps().forEach(step -> log.debug("Step: " + step));
		}
		return service.editRecipe(email, req);
	}

}

package com.coffeeApp.service;

import com.coffeeApp.dto.FavoriteResponse;

public interface PrivateService {
	public FavoriteResponse addFavorite(String mailAddress, int recipeId);

	public FavoriteResponse removeFavorite(String mailAddress, int recipeId);

}

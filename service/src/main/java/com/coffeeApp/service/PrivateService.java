package com.coffeeApp.service;

import com.coffeeApp.dto.DeleteRequest;
import com.coffeeApp.dto.DeleteResponse;
import com.coffeeApp.dto.FavoriteRequest;
import com.coffeeApp.dto.FavoriteResponse;
import com.coffeeApp.dto.Recipe;
import com.coffeeApp.exception.BusinessException;

public interface PrivateService {
	public FavoriteResponse handleFavorite(String mailAddress, FavoriteRequest req);

	public DeleteResponse handleDelete(DeleteRequest req);

	public Recipe addRecipe(String mailAddress, Recipe req) throws BusinessException;

	public Recipe editRecipe(String mailAddress, Recipe req) throws BusinessException;

}

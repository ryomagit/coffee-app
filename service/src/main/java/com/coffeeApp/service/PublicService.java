package com.coffeeApp.service;

import java.util.List;

import com.coffeeApp.dto.Recipe;
import com.coffeeApp.dto.SigninRequest;
import com.coffeeApp.exception.BusinessException;

public interface PublicService {
	public void createAccount(SigninRequest req) throws BusinessException;

	public List<Recipe> getRecipesWithDetails(String mailAddress) throws BusinessException;

}

package com.coffeeApp.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coffeeApp.dto.DeleteRequest;
import com.coffeeApp.dto.DeleteResponse;
import com.coffeeApp.dto.FavoriteRequest;
import com.coffeeApp.dto.FavoriteResponse;
import com.coffeeApp.dto.Recipe;
import com.coffeeApp.dto.RecipeStep;
import com.coffeeApp.exception.BusinessException;
import com.coffeeApp.mapper.FavoriteMapper;
import com.coffeeApp.mapper.RecipeMapper;
import com.coffeeApp.mapper.RecipeStepsMapper;
import com.coffeeApp.service.PrivateService;

@Service
public class PrivateServiceImpl implements PrivateService {

	@Autowired
	FavoriteMapper favoriteMapper;

	@Autowired
	RecipeMapper recipeMapper;

	@Autowired
	RecipeStepsMapper recipeStepsMapper;

	@Override
	public FavoriteResponse handleFavorite(String mailAddress, FavoriteRequest req) {
		// TODO 自動生成されたメソッド・スタブ
		int recipeId = req.getRecipeId();
		boolean isFavorited = req.isFavorited();
		FavoriteResponse res = new FavoriteResponse();
		if (isFavorited) {
			favoriteMapper.deleteFavorite(mailAddress, recipeId);
			res.setFavorited(false);
		} else {
			favoriteMapper.insertFavorite(mailAddress, recipeId);
			res.setFavorited(true);
		}
		return res;
	}

	@Override
	@Transactional
	public DeleteResponse handleDelete(DeleteRequest req) {
		int targetRecipeId = req.getRecipeId();
		int deletedStep = recipeStepsMapper.deleteRecipeStepByRecipeId(targetRecipeId);
		int deletedFavorite = favoriteMapper.deleteFavoritesByRecipeId(targetRecipeId);
		int deletedRecipe = recipeMapper.deleteRecipe(targetRecipeId);
		DeleteResponse res = new DeleteResponse();
		if (deletedRecipe == 1) {
			res.setDeleteId(targetRecipeId);
		}
		return res;
	}

	@Override
	@Transactional
	public Recipe addRecipe(String mailAddress, Recipe req) throws BusinessException {
		req.setAuthorMailAddress(mailAddress);
		recipeMapper.insertRecipe(req);
		int newRecipeId = req.getId();
		List<RecipeStep> addSteps = req.getSteps();
		if (addSteps == null || addSteps.isEmpty()) {
			throw new BusinessException("invalid parameter");
		}
		addSteps.forEach(step -> step.setRecipeId(newRecipeId));
		recipeStepsMapper.insertRecipeSteps(addSteps);
		return recipeMapper.getRecipeWithDetails(mailAddress, newRecipeId);
	}

	@Override
	@Transactional
	public Recipe editRecipe(String mailAddress, Recipe req) throws BusinessException {
		List<RecipeStep> upsertSteps = req.getSteps();
		if (upsertSteps == null || upsertSteps.isEmpty()) {
			throw new BusinessException("invalid parameter");
		}
		req.setAuthorMailAddress(mailAddress);
		int updatedRecipe = recipeMapper.updateRecipe(req);
		int recipeId = req.getId();
		int upsertRecipeSteps = recipeStepsMapper.upsertRecipeSteps(recipeId, upsertSteps);
		if (updatedRecipe + upsertRecipeSteps > 0) {
			return recipeMapper.getRecipeWithDetails(mailAddress, recipeId);
		} else {
			return null;
		}
	}

}

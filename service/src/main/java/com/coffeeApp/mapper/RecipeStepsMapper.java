package com.coffeeApp.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.coffeeApp.dto.RecipeStep;

@Mapper
public interface RecipeStepsMapper {
	int deleteRecipeStepByRecipeId(@Param("recipeId") int recipeId);

	void insertRecipeSteps(@Param("list") List<RecipeStep> steps);

	int upsertRecipeSteps(@Param("recipeId") int recipeId, @Param("list") List<RecipeStep> steps);
}

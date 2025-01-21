package com.coffeeApp.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.coffeeApp.dto.Recipe;

@Mapper
public interface RecipeMapper {
	List<Recipe> getRecipesWithDetails(@Param("emailAddress") String emailAddress);
}

package com.coffeeApp.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FavoriteMapper {
	// お気に入りを追加するメソッド
	void insertFavorite(
			@Param("userMailAddress") String userMailAddress,
			@Param("recipeId") int recipeId);

	// お気に入りを削除するメソッド
	void deleteFavorite(
			@Param("userMailAddress") String userMailAddress,
			@Param("recipeId") int recipeId);

	int deleteFavoritesByRecipeId(@Param("recipeId") int recipeId);
}

package com.coffeeApp.dto;

import lombok.Data;

@Data
public class FavoriteRequest {
	private int recipeId;
	private boolean favorited;

}

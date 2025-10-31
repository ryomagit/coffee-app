package com.coffeeApp.dto;

import lombok.Data;

@Data
public class RecipeStep {
	private int id;
	private int recipeId;
	private String startTime;
	private int waterAmount;
}

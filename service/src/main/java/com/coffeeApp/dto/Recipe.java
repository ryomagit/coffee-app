package com.coffeeApp.dto;

import java.util.List;

import lombok.Data;

@Data
public class Recipe {

	private int id;
	private String title;
	private String createdAt;
	private int brewingMethod;
	private int roastLevel;
	private int beanAmount;
	private int grindSize;
	private int waterTemp;
	private String authorMailAddress;
	private int favoriteCount;
	private boolean isFavorited;
	private List<RecipeStep> steps;

}

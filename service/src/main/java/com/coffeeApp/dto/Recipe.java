package com.coffeeApp.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Recipe {

	private int id;
	private String title;
	private String memo;
	private String createdAt;
	private int brewingMethod;
	private int roastLevel;
	private int beanAmount;
	private int grindSize;
	private int waterTemp;
	private String authorMailAddress;
	private int favoriteCount;
	@JsonProperty("isFavorited")
	private boolean isFavorited;
	@JsonProperty("isOwner")
	private boolean isOwner;
	@JsonProperty("steps")
	private List<RecipeStep> steps;

}

package com.coffeeApp.dto;

import lombok.Data;

@Data
public class RecipeStep {
	private int id;
	private String startTime;
	private String endTime;
	private int waterAmount;

}

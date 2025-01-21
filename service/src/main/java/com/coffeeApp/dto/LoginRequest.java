package com.coffeeApp.dto;

import lombok.Data;

@Data
public class LoginRequest {
	private String mailAddress;
	private String password;

}

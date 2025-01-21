package com.coffeeApp.dto;

import lombok.Data;

@Data
public class SigninRequest {
	private String mailAddress;
	private String password;
	private String confirmPassword;
}

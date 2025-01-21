package com.coffeeApp.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUserDetails implements UserDetails {
	private String emailAddress;

	public CustomUserDetails(String email) {
		this.emailAddress = email;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		// TODO 自動生成されたメソッド・スタブ
		return null;
	}

	@Override
	public String getPassword() {
		// TODO 自動生成されたメソッド・スタブ
		return null;
	}

	@Override
	public String getUsername() {
		// TODO 自動生成されたメソッド・スタブ
		return null;
	}

}

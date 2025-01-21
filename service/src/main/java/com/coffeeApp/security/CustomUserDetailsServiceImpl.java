package com.coffeeApp.security;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.coffeeApp.dto.User;
import com.coffeeApp.mapper.UserMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private UserMapper userMapper;

	@Override
	public UserDetails loadUserByUsername(String mailAddress) throws UsernameNotFoundException {
		// 本番環境では、ここでデータベースからユーザー情報を取得する
		User user = userMapper.findByMailAddress(mailAddress);
		if (user == null) {
			log.warn("User not found for mail address: {}", mailAddress);
			throw new UsernameNotFoundException("User not found with mail address: " + mailAddress);
		}
		log.info("User retrieved: {}", user);

		if (user.getMailAddress() == null || user.getMailAddress().isEmpty()) {
			throw new IllegalArgumentException("User mail address is null or empty");
		}

		if (user.getPassword() == null || user.getPassword().isEmpty()) {
			throw new IllegalArgumentException("User password is null or empty");
		}
		return new org.springframework.security.core.userdetails.User(
				user.getMailAddress(),
				user.getPassword(),
				Collections.emptyList() // 権限情報は不要
		);
	}
}

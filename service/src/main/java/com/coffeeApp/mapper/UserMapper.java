package com.coffeeApp.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.coffeeApp.dto.User;

@Mapper
public interface UserMapper {
	// メールアドレスでユーザーを検索
	User findByMailAddress(@Param("mailAddress") String mailAddress);

	void insertUser(@Param("mailAddress") String mailAddress, @Param("password") String password);
}

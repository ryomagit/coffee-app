package com.coffeeApp.serviceImpl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.coffeeApp.dto.SigninRequest;
import com.coffeeApp.exception.BusinessException;
import com.coffeeApp.mapper.UserMapper;
import com.coffeeApp.service.PublicService;

@Service
public class PublicServiceImpl implements PublicService {
	@Autowired
	private UserMapper userMapper;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public void createAccount(SigninRequest req) throws BusinessException {
		if (!StringUtils.equals(req.getPassword(), req.getConfirmPassword())) {
			throw new BusinessException("password mismatch");
		}
		if (userMapper.findByMailAddress(req.getMailAddress()) != null) {
			throw new BusinessException("email already exist: " + req.getMailAddress());
		}
		String hashedPassword = passwordEncoder.encode(req.getPassword());
		userMapper.insertUser(req.getMailAddress(), hashedPassword);

	}

}

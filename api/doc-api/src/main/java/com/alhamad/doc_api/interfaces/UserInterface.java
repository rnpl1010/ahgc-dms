package com.alhamad.doc_api.interfaces;

import java.util.Optional;

import com.alhamad.doc_api.model.UserModel;

public interface UserInterface {

	boolean login(String username, String passwordHash);

	Optional<UserModel> getUserByUsername(String username);

	public void setToken(String username, String token);

	public Optional<String> getToken(String username);

	public void logout(String username);
	
	Optional<UserModel> validateToken(String token);

}

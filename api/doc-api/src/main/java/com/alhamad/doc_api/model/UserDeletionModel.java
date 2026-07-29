package com.alhamad.doc_api.model;

public class UserDeletionModel {
	private String username;

	public UserDeletionModel() {
	} 

	public UserDeletionModel(String username) {
		this.username = username;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
}

package com.alhamad.doc_api.model;

import java.time.LocalDateTime;

public class UserModel {

	private String employeeID;
	private String username;
	private String email;
	private String role;
	private LocalDateTime dateUpdated;

	public UserModel(String employeeID, String username, String email, String role, LocalDateTime dateUpdated) {
		super();
		this.employeeID = employeeID;
		this.username = username;
		this.email = email;
		this.role = role;
		this.dateUpdated = dateUpdated;
	}

	public String getEmployeeID() {
		return employeeID;
	}

	public void setEmployeeID(String employeeID) {
		this.employeeID = employeeID;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public LocalDateTime getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(LocalDateTime dateUpdated) {
		this.dateUpdated = dateUpdated;
	}

}

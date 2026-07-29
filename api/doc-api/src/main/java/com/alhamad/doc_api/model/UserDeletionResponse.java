package com.alhamad.doc_api.model;

public class UserDeletionResponse {
	private int status;
	private String message;

	public UserDeletionResponse(int status, String message) {
		this.status = status;
		this.message = message;
	}

	// Getters and setters
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}

package com.alhamad.doc_api.model;

public class RequestDataModel {

	private String userName;
	private int documentID;

	public RequestDataModel() {
	}

	public RequestDataModel(String userName, int documentID) {
		this.userName = userName;
		this.documentID = documentID;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public int getDocumentID() {
		return documentID;
	}

	public void setDocumentID(int documentID) {
		this.documentID = documentID;
	}

}

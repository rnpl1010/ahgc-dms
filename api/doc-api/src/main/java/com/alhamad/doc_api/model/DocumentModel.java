package com.alhamad.doc_api.model;

public class DocumentModel {

	private String documentPath;
	private String documentName;
	private String fileType;
	private String fileSize;
	private String lastModified;
	private int status;
	private String message;
	private String company;

	public DocumentModel() {
	}

	public DocumentModel(String documentPath, String documentName, String fileType, String fileSize, String lastModified, int status, String message, String company) {
		this.documentPath = documentPath;
		this.documentName = documentName;
		this.fileType = fileType;
		this.fileSize = fileSize;
		this.lastModified = lastModified;
		this.status = status;
		this.message = message;
		this.company = company;
	}

	public String getDocumentPath() {
		return documentPath;
	}

	public void setDocumentPath(String documentPath) {
		this.documentPath = documentPath;
	}

	public String getDocumentName() {
		return documentName;
	}

	public void setDocumentName(String documentName) {
		this.documentName = documentName;
	}

	public String getFileType() {
		return fileType;
	}

	public String getFileSize() {
		return fileSize;
	}

	public void setFileSize(String fileSize) {
		this.fileSize = fileSize;
	}

	public String getLastModified() {
		return lastModified;
	}

	public void setLastModified(String lastModified) {
		this.lastModified = lastModified;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}

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

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

}

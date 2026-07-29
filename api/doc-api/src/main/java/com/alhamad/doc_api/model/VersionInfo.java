package com.alhamad.doc_api.model;

public class VersionInfo {
	private String version;
	private String dateUpdated;

	public VersionInfo() {
	}

	public VersionInfo(String version, String dateUpdated) {
		this.version = version;
		this.dateUpdated = dateUpdated;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(String dateUpdated) {
		this.dateUpdated = dateUpdated;
	}
}

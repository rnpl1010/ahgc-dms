package com.alhamad.doc_api.controller;

import com.alhamad.doc_api.model.VersionInfo;
import com.google.gson.Gson;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VersionController {
	
	@Autowired
	Gson gson;

	private static final Logger log = Logger.getLogger(VersionController.class);
	
    @GetMapping("/api/version")
    public VersionInfo getVersion() {
    	
    	String version = "v1.0.0";
    	String dateUpdated = "2025-10-20";
    	
    	VersionInfo versionInfo = new VersionInfo(version, dateUpdated);
    	
    	log.info("Version Info : " + gson.toJson(versionInfo));
    	
        return versionInfo;
    }
}

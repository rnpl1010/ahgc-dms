package com.alhamad.doc_api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.google.gson.Gson;
import com.alhamad.doc_api.model.SubsidiaryCompany;
import com.alhamad.doc_api.service.SubsidiaryCompanyService;

import org.apache.log4j.Logger;

@RestController
@RequestMapping("/api")
public class SubsidiaryCompanyController {

    private static final Logger log = Logger.getLogger(SubsidiaryCompanyController.class);

    @Autowired
    private SubsidiaryCompanyService subsidiaryCompanyService;

    @GetMapping("/companies")
    public ResponseEntity<?> getAllSubsidiaryCompanies() {
        try {
            List<SubsidiaryCompany> companies = subsidiaryCompanyService.getAllSubsidiaryCompanies();

            log.info("Request Result: " + new Gson().toJson(companies));

            return ResponseEntity.ok(companies);
        } catch (Exception e) {
            log.error("Error fetching subsidiary companies", e);

            return ResponseEntity
                    .status(500)
                    .body("Error fetching subsidiary companies: " + e.getMessage());
        }
    }
}

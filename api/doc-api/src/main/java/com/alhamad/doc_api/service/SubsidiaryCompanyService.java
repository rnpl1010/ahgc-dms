package com.alhamad.doc_api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alhamad.doc_api.dao.SubsidiaryCompanyDao;
import com.alhamad.doc_api.model.SubsidiaryCompany;

@Service
public class SubsidiaryCompanyService {

    @Autowired
    private SubsidiaryCompanyDao subsidiaryCompanyDao;

    public List<SubsidiaryCompany> getAllSubsidiaryCompanies() {
        return subsidiaryCompanyDao.getAllSubsidiaryCompanies();
    }
}

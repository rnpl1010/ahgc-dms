package com.alhamad.doc_api.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.alhamad.doc_api.interfaces.SubsidiaryCompanyInterface;
import com.alhamad.doc_api.model.SubsidiaryCompany;

@Repository
public class SubsidiaryCompanyDao implements SubsidiaryCompanyInterface {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<SubsidiaryCompany> rowMapper = (rs, rowNum) -> {
        SubsidiaryCompany sc = new SubsidiaryCompany();
        sc.setShortName(rs.getString("short_name"));
        sc.setLongName(rs.getString("long_name"));
        return sc;
    };

    @Override
    public List<SubsidiaryCompany> getAllSubsidiaryCompanies() {
        String sql = "SELECT short_name, long_name FROM SubsidiaryCompanies";
        return jdbcTemplate.query(sql, rowMapper);
    }
}

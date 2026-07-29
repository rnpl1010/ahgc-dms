package com.alhamad.doc_api.dao;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.apache.log4j.Logger;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.alhamad.doc_api.model.FileModel;

@Repository
public class FileRepositoryDao {

	private static final Logger log = Logger.getLogger(FileRepositoryDao.class);

	private final JdbcTemplate jdbcTemplate;

	public FileRepositoryDao(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public boolean save(final FileModel file) {
	    // Include company as a parameter
	    final String sql = "SELECT insert_file(?, ?, ?, ?)";

	    try {
	        Boolean inserted = jdbcTemplate.queryForObject(
	                sql,
	                Boolean.class,
	                file.getFileName(),
	                file.getFileType(),
	                file.getData(),
	                file.getCompany() // <--- added company
	        );

	        if (inserted != null && inserted) {
	            log.info("File saved successfully: " + file.getFileName() + " (Company: " + file.getCompany() + ")");
	            return true;
	        } else {
	            log.warn("File already exists: " + file.getFileName() + " (Company: " + file.getCompany() + ")");
	            return false;
	        }

	    } catch (DataAccessException ex) {
	        log.error("Failed to save file: " + file.getFileName() + " (Company: " + file.getCompany() + ")", ex);
	        return false;
	    }
	}

	public Optional<FileModel> findById(final int id) {
	    final String sql = "SELECT id, file_name, file_type, data, company, uploaded_at FROM get_file_by_id(?)";

	    try {
	        FileModel file = jdbcTemplate.queryForObject(
	            sql,
	            (rs, rowNum) -> {
	                FileModel f = new FileModel();
	                f.setId(rs.getInt("id"));
	                f.setFileName(rs.getString("file_name"));
	                f.setFileType(rs.getString("file_type"));
	                f.setData(rs.getBytes("data"));
	                f.setCompany(rs.getString("company"));
	                f.setUploadedAt(rs.getTimestamp("uploaded_at").toLocalDateTime());
	                return f;
	            },
	            id
	        );

	        if (file != null) {
	            log.info("File found: " + file.getFileName());
	            return Optional.of(file);
	        } else {
	            log.warn("File not found with id: " + id);
	            return Optional.empty();
	        }

	    } catch (EmptyResultDataAccessException e) {
	        log.warn("File not found with id: " + id, e);
	        return Optional.empty();
	    } catch (DataAccessException e) {
	        log.error("Error querying file with id: " + id, e);
	        return Optional.empty();
	    }
	}
	
	public Optional<FileModel> findByName(final String fileName) {
	    final String sql = "SELECT id, file_name, file_type, data, company, uploaded_at FROM get_file_by_name(?)";

	    try {
	        FileModel file = jdbcTemplate.queryForObject(
	            sql,
	            (rs, rowNum) -> {
	                FileModel f = new FileModel();
	                f.setId(rs.getInt("id"));
	                f.setFileName(rs.getString("file_name"));
	                f.setFileType(rs.getString("file_type"));
	                f.setData(rs.getBytes("data"));
	                f.setCompany(rs.getString("company"));
	                f.setUploadedAt(rs.getTimestamp("uploaded_at").toLocalDateTime());
	                return f;
	            },
	            fileName
	        );

	        if (file != null) {
	            log.info("File found: " + file.getFileName());
	            return Optional.of(file);
	        } else {
	            log.warn("File not found with name: " + fileName);
	            return Optional.empty();
	        }

	    } catch (EmptyResultDataAccessException e) {
	        log.warn("File not found with name: " + fileName, e);
	        return Optional.empty();
	    } catch (DataAccessException e) {
	        log.error("Error querying file with name: " + fileName, e);
	        return Optional.empty();
	    }
	}
	
	public Optional<FileModel> deleteByName(final String fileName) {
	    final String sql = "SELECT * FROM del_file_by_name(?)";

	    try {
	        FileModel file = jdbcTemplate.queryForObject(
	            sql,
	            (rs, rowNum) -> {
	                FileModel f = new FileModel();
	                f.setId(rs.getInt("id"));
	                f.setFileName(rs.getString("file_name"));
	                f.setFileType(rs.getString("file_type"));
	                f.setData(rs.getBytes("data"));
	                f.setCompany(rs.getString("company"));
	                f.setUploadedAt(rs.getTimestamp("uploaded_at").toLocalDateTime());
	                return f;
	            },
	            fileName
	        );

	        return Optional.ofNullable(file);

	    } catch (EmptyResultDataAccessException e) {
	        log.warn("File not found with name: " + fileName, e);
	        return Optional.empty();
	    } catch (DataAccessException e) {
	        log.error("Error deleting file with name: " + fileName, e);
	        return Optional.empty();
	    }
	}

	public List<FileModel> findAll() {
	    final String sql = "SELECT id, file_name, file_type, company, uploaded_at FROM get_all_files()";

	    try {
	        List<FileModel> files = jdbcTemplate.query(sql, (rs, rowNum) -> {
	            FileModel f = new FileModel();
	            f.setId(rs.getInt("id"));
	            f.setFileName(rs.getString("file_name"));
	            f.setFileType(rs.getString("file_type"));
	            f.setCompany(rs.getString("company"));
	            f.setUploadedAt(rs.getTimestamp("uploaded_at").toLocalDateTime());
	            return f;
	        });

	        log.info("Retrieved " + files.size() + " files from database");
	        return files;

	    } catch (DataAccessException e) {
	        log.error("❌ Error retrieving all files", e);
	        return Collections.emptyList();
	    }
	}
}

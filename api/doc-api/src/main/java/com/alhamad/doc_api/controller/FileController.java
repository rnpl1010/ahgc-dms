package com.alhamad.doc_api.controller;

import org.apache.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.alhamad.doc_api.model.DocumentModel;
import com.alhamad.doc_api.model.FileModel;
import com.alhamad.doc_api.service.FileService;
import com.google.gson.Gson;

import javax.servlet.http.HttpServletRequest;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Collections;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000") 
public class FileController {

    private static final Logger log = Logger.getLogger(FileController.class);

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentModel> uploadFile(
            @RequestParam MultipartFile file,
            @RequestParam String company,
            HttpServletRequest request) {
        try {
            FileModel fileModel = new FileModel();
            boolean inserted = fileService.saveFile(file, company, fileModel);

            Optional<FileModel> savedFileOpt = fileService.findByName(file.getOriginalFilename());
            if (!savedFileOpt.isPresent()) {
                DocumentModel errorResponse = new DocumentModel(null, null, null, null, null, 500, "Error fetching file from database", null);
                log.info("Error: " + new Gson().toJson(errorResponse));
                return ResponseEntity.status(500).body(errorResponse);
            }

            FileModel savedFile = savedFileOpt.get();

            String baseUrl = request.getRequestURL().toString().replace(request.getRequestURI(), request.getContextPath());
            String docLink = baseUrl + "/files/" + savedFile.getFileName();
            String sizeKB = (file.getSize() / 1024) + " KB";
            String lastModified = savedFile.getUploadedAt().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME);

            // Include company in DocumentModel if needed
            DocumentModel response = new DocumentModel(docLink, savedFile.getFileName(), savedFile.getFileType(), sizeKB, lastModified, 200, "File uploaded successfully", savedFile.getCompany());
            response.setCompany(savedFile.getCompany()); // <-- include company

            log.info("Request Result: " + new Gson().toJson(response));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error uploading file", e);
            DocumentModel errorResponse = new DocumentModel(null, null, null, null, null, 500, "Error uploading file: " + e.getMessage(), null);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }


    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<byte[]> downloadFileByName(@PathVariable String filename, HttpServletRequest request) {
        try {
            // Decode filename from URL
        	String decodedFilename = URLDecoder.decode(filename, "UTF-8");
            Optional<FileModel> optionalFile = fileService.findByName(decodedFilename);

            if (!optionalFile.isPresent()) {
                DocumentModel errorResponse = new DocumentModel(
                        null, null, null, null, null, 404,
                        "File not found: " + decodedFilename, null
                );
                log.info("Request Result: " + new Gson().toJson(errorResponse));
                return ResponseEntity.status(404).body(null);
            }

            FileModel file = optionalFile.get();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                    .contentType(MediaType.parseMediaType(file.getFileType()))
                    .body(file.getData());

        } catch (Exception e) {
            log.error("Error downloading file: " + filename, e);
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @GetMapping("/preview/{filename:.+}")
    public ResponseEntity<byte[]> previewFile(@PathVariable String filename) {
        try {
            // Decode the filename
        	String decodedFilename = URLDecoder.decode(filename, "UTF-8");
            Optional<FileModel> optionalFile = fileService.findByName(decodedFilename);

            if (!optionalFile.isPresent()) {
                return ResponseEntity.status(404).body(null);
            }

            FileModel file = optionalFile.get();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFileName() + "\"")
                    .contentType(MediaType.parseMediaType(file.getFileType()))
                    .body(file.getData());

        } catch (Exception e) {
            log.error("Error previewing file: " + filename, e);
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @GetMapping("/delete/{filename:.+}")
    public ResponseEntity<byte[]> deleteFileByName(@PathVariable String filename) {
        try {
            // Decode the filename
        	String decodedFilename = URLDecoder.decode(filename, "UTF-8");
            Optional<FileModel> optionalFile = fileService.deleteByName(decodedFilename);

            if (!optionalFile.isPresent()) {
                return ResponseEntity.status(404).body(null);
            }

            FileModel file = optionalFile.get();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                    .contentType(MediaType.parseMediaType(file.getFileType()))
                    .body(file.getData());

        } catch (Exception e) {
            log.error("Error deleting file: " + filename, e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/document-list")
    public ResponseEntity<List<DocumentModel>> listFiles(HttpServletRequest request) {
        try {
            List<FileModel> files = fileService.findAll();
            String baseUrl = request.getRequestURL().toString().replace(request.getRequestURI(), request.getContextPath());

            List<DocumentModel> responseList = files.stream().map(file -> {
                String docLink = baseUrl + "/files/" + file.getFileName();
                String sizeKB = (file.getData() != null ? file.getData().length / 1024 : 0) + " KB";
                String lastModified = file.getUploadedAt() != null
                        ? file.getUploadedAt().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        : null;

                return new DocumentModel(
                        docLink,
                        file.getFileName(),
                        file.getFileType(),
                        sizeKB,
                        lastModified,
                        200,
                        "File retrieved successfully",
                        file.getCompany());
            }).collect(Collectors.toList());

            log.info("Request Result: " + new Gson().toJson(responseList));
            return ResponseEntity.ok(responseList);

        } catch (Exception e) {
            log.error("Error listing files", e);
            DocumentModel errorResponse = new DocumentModel(null, null, null, null, null, 500, "Error retrieving files: " + e.getMessage(), null);
            log.info("Request Result: " + new Gson().toJson(Collections.singletonList(errorResponse)));
            return ResponseEntity.status(500).body(Collections.singletonList(errorResponse));
        }
    }
}

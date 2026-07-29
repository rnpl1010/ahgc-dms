package com.alhamad.doc_api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.alhamad.doc_api.dao.FileRepositoryDao;
import com.alhamad.doc_api.model.FileModel;

@Service
public class FileService {

    private final FileRepositoryDao fileRepository;

    public FileService(FileRepositoryDao fileRepository) {
        this.fileRepository = fileRepository;
    }

    public boolean saveFile(MultipartFile file, String company, FileModel fileModel) throws Exception {
        fileModel.setFileName(file.getOriginalFilename());
        fileModel.setFileType(file.getContentType());
        fileModel.setData(file.getBytes());
        fileModel.setCompany(company);
        return fileRepository.save(fileModel);
    }

    public Optional<FileModel> findByName(String fileName) {
        return fileRepository.findByName(fileName);
    }
    
    public Optional<FileModel> deleteByName(String fileName) {
        return fileRepository.deleteByName(fileName);
    }

    public Optional<FileModel> findById(int id) {
        return fileRepository.findById(id);
    }

    public List<FileModel> findAll() {
        return fileRepository.findAll();
    }
}

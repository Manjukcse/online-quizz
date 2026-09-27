package com.example.exam.service.impl;

import com.example.exam.dto.LearningResourceDTO;
import com.example.exam.entity.Exam;
import com.example.exam.entity.LearningResource;
import com.example.exam.exception.ResourceNotFoundException;
import com.example.exam.repository.ExamRepository;
import com.example.exam.repository.LearningResourceRepository;
import com.example.exam.service.LearningResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LearningResourceServiceImpl implements LearningResourceService {

    @Autowired
    private LearningResourceRepository resourceRepository;

    @Autowired
    private ExamRepository examRepository;

    @Override
    @Transactional(readOnly = true)
    public List<LearningResourceDTO> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LearningResourceDTO> getResourcesByExamId(Long examId) {
        return resourceRepository.findByExamId(examId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LearningResourceDTO createResource(LearningResourceDTO dto) {
        Exam exam = null;
        if (dto.getExamId() != null) {
            exam = examRepository.findById(dto.getExamId()).orElse(null);
        }

        LearningResource resource = LearningResource.builder()
                .exam(exam)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .resourceUrl(dto.getResourceUrl())
                .build();

        return mapToDTO(resourceRepository.save(resource));
    }

    @Override
    @Transactional
    public void deleteResource(Long resourceId) {
        LearningResource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + resourceId));
        resourceRepository.delete(resource);
    }

    private LearningResourceDTO mapToDTO(LearningResource resource) {
        return LearningResourceDTO.builder()
                .id(resource.getId())
                .examId(resource.getExam() != null ? resource.getExam().getId() : null)
                .examTitle(resource.getExam() != null ? resource.getExam().getTitle() : "General")
                .title(resource.getTitle())
                .description(resource.getDescription())
                .resourceUrl(resource.getResourceUrl())
                .createdAt(resource.getCreatedAt())
                .build();
    }
}
